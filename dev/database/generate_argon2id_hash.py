from argon2 import PasswordHasher

hasher = PasswordHasher()
hash = hasher.hash("test123")
print(hash)