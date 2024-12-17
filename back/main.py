from fastapi import FastAPI, Depends, HTTPException, status, Form, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime, timedelta
import hashlib
import hmac
import base64
import json
import os

app = FastAPI()

DATABASE_URL = "sqlite:///./knives.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Knife(Base):
    __tablename__ = "knives"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    manufacturer = Column(String, index=True)
    article = Column(String, unique=True, index=True)
    price = Column(Float)
    status = Column(Boolean, default=True)
    description = Column(String)
    photo = Column(String, nullable=True)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)

Base.metadata.create_all(bind=engine)

SECRET_KEY = "secretjwtkey123"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hmac.compare_digest(hash_password(plain_password), hashed_password)

def create_jwt_token(data: dict, expires_delta: timedelta):
    payload = data.copy()
    payload.update({"exp": (datetime.utcnow() + expires_delta).timestamp()})
    token = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode()
    return token

def decode_jwt_token(token: str) -> dict:
    try:
        payload = json.loads(base64.urlsafe_b64decode(token.encode()))
        if datetime.utcnow().timestamp() > payload["exp"]:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
        return payload
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

def get_user_by_username(db, username: str):
    return db.query(User).filter(User.username == username).first()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_jwt_token(token)
    user = get_user_by_username(db, payload.get("sub"))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

async def get_admin_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin")
    return current_user

@app.post("/register", summary="Регистрация пользователя")
def register_user(
    username: str = Form(),
    password: str = Form(),
    is_admin: bool = Form(False),
    db: Session = Depends(get_db)
):
    if get_user_by_username(db, username):
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = hash_password(password)
    new_user = User(username=username, hashed_password=hashed_password, is_admin=is_admin)
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/token", summary="Получение токена")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user_by_username(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_jwt_token({"sub": user.username, "is_admin": user.is_admin}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": token, "token_type": "bearer"}

UPLOAD_FOLDER = "uploads"

@app.get("/all_knives/", summary="Получить список ножей")
def get_knives(db: Session = Depends(get_db)):
    knives = db.query(Knife).all()
    return {"knives": knives}
@app.post("/add_knives/", summary="Добавить нож (только для админa)")
def add_knife(
    name: str = Form(),
    manufacturer: str = Form(),
    article: str = Form(),
    price: float = Form(),
    status: bool = Form(True),
    description: str = Form(),
    photo: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    photo_path = None
    if photo:
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        photo_path = os.path.join(UPLOAD_FOLDER, photo.filename)
        with open(photo_path, "wb") as f:
            f.write(photo.file.read())

    knife = Knife(
        name=name,
        manufacturer=manufacturer,
        article=article,
        price=price,
        status=status,
        description=description,
        photo=photo_path
    )
    db.add(knife)
    db.commit()
    db.refresh(knife)
    return {"message": "Knife added successfully", "knife": knife}
@app.put("/edit_knives/{knife_id}", summary="Обновить нож (только для админa)")
def update_knife(
    knife_id: int,
    name: str = Form(None),
    manufacturer: str = Form(None),
    price: float = Form(None),
    description: str = Form(None),
    photo: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    knife = db.query(Knife).filter(Knife.id == knife_id).first()
    if not knife:
        raise HTTPException(status_code=404, detail="Knife not found")
    if name: knife.name = name
    if manufacturer: knife.manufacturer = manufacturer
    if price: knife.price = price
    if description: knife.description = description

    if photo:
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        photo_path = os.path.join(UPLOAD_FOLDER, photo.filename)
        with open(photo_path, "wb") as f:
            f.write(photo.file.read())
        knife.photo = photo_path

    db.commit()
    db.refresh(knife)
    return {"message": "Knife updated successfully", "knife": knife}

@app.delete("/delete_knives/{knife_id}", summary="Удалить нож (только для админa)")
def delete_knife(
    knife_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    knife = db.query(Knife).filter(Knife.id == knife_id).first()
    if not knife:
        raise HTTPException(status_code=404, detail="Knife not found")
    db.delete(knife)
    db.commit()
    return {"message": "Knife deleted successfully"}
