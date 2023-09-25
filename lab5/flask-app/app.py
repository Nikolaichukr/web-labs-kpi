from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from flask_login import (
    LoginManager,
    UserMixin,
    login_user,
    login_required,
    logout_user,
    current_user,
)
import pycountry
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.secret_key = "this_codebase_is_a_mess"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = "login"
bcrypt = Bcrypt(app)


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    surname = db.Column(db.String(50), nullable=False)
    country = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), default="user")


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route("/")
def home():
    if current_user.is_authenticated:
        if current_user.role == "admin":
            return redirect(url_for("admin_panel"))
        return redirect(url_for("profile"))
    return redirect(url_for("login"))


@app.route("/profile")
@login_required
def profile():
    if current_user.role == "admin":
        return redirect(url_for("admin_panel"))
    return render_template("profile.html", user=current_user)


@app.route("/admin")
@login_required
def admin_panel():
    if current_user.role != "admin":
        return redirect(url_for("profile"))
    users = User.query.all()
    return render_template("admin.html", users=users)


@app.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("profile"))
    if request.method == "POST":
        email = request.form.get("email")
        plaintext_password = request.form.get("password")
        name = request.form.get("name")
        surname = request.form.get("surname")
        country = request.form.get("country")

        hashed_password = bcrypt.generate_password_hash(plaintext_password).decode(
            "utf-8"
        )

        user = User(
            email=email,
            password=hashed_password,
            name=name,
            surname=surname,
            country=country,
        )
        try:
            db.session.add(user)
            db.session.commit()
            flash("Registration successful. You can now log in.", "success")
            return redirect(url_for("login"))
        except IntegrityError:
            db.session.rollback()
            flash("Registration failed. This email is already registered.", "danger")

    countries = list(pycountry.countries)

    return render_template("register.html", countries=countries)


@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("profile"))
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        user = User.query.filter_by(email=email).first()

        if user:
            try:
                if bcrypt.check_password_hash(user.password, password):
                    login_user(user)
                    flash("Login successful.", "success")
                    if user.role == "admin":
                        return redirect(url_for("admin_panel"))
                    else:
                        return redirect(url_for("profile"))
                else:
                    flash(
                        "Login failed. Please check your email and password.", "danger"
                    )
            except ValueError:
                flash("Login failed. Please check your email and password.", "danger")
        else:
            flash("Login failed. User does not exist.", "danger")

    return render_template("login.html")


@app.route("/logout")
@login_required
def logout():
    logout_user()
    session.pop("user_id", None)
    flash("You have been logged out", "info")
    return redirect(url_for("login"))


@app.route("/admin/create_user", methods=["GET", "POST"])
def create_user():
    if current_user.role != "admin":
        return redirect(url_for("profile"))
    if request.method == "POST":
        email = request.form["email"]
        plaintext_password = request.form["password"]
        name = request.form["name"]
        surname = request.form["surname"]
        country = request.form["country"]
        hashed_password = bcrypt.generate_password_hash(plaintext_password).decode(
            "utf-8"
        )
        new_user = User(
            email=email,
            password=hashed_password,
            name=name,
            surname=surname,
            country=country,
        )
        db.session.add(new_user)
        db.session.commit()
        flash("User created successfully", "success")
        return redirect(url_for("admin_panel"))

    countries = list(pycountry.countries)

    return render_template("create_user.html", countries=countries)


@app.route("/admin/edit_user/<int:user_id>", methods=["GET", "POST"])
def edit_user(user_id):
    if current_user.role != "admin":
        return redirect(url_for("profile"))

    user = User.query.get(user_id)

    if request.method == "POST":
        user.email = request.form["email"]
        user.name = request.form["name"]
        user.surname = request.form["surname"]
        user.country = request.form["country"]
        user.role = request.form["role"]

        db.session.commit()
        flash("User updated successfully", "success")
        return redirect(url_for("admin_panel"))

    countries = list(pycountry.countries)

    return render_template("edit_user.html", user=user, countries=countries)


@app.route("/admin/delete_user/<int:user_id>", methods=["GET"])
def delete_user(user_id):
    if current_user.role != "admin":
        return redirect(url_for("profile"))

    user = User.query.get(user_id)
    db.session.delete(user)
    db.session.commit()
    flash("User deleted successfully", "success")
    return redirect(url_for("admin_panel"))


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
