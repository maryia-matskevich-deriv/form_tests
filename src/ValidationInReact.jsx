import React from "react";

class validationInReact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        first_name: "",
        email: "",
        password: "",
        confirm_password: "",
        mobile: ""
      },
      errors: {
        first_name: "",
        email: "",
        password: "",
        mobile: "",
        confirm_password: ""
      }
    };
  }

  validate = (name, value) => {
    const { fields } = this.state;
    switch (name) {
      case "first_name":
        if (!value || (value.trim() === "") | (value.length < 2)) {
          return "First name is required";
        } else {
          return "";
        }
      case "email":
        if (!value) {
          return "Email is required";
        } else if (
          !value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
        ) {
          return "Enter a valid email address";
        } else {
          return "";
        }
      case "mobile":
        if (!value || value.trim() === "") {
          return "Mobile number is required";
        } else if (!value.match(/^[6-9]\d{9}$/)) {
          return "Enter a valid mobile number.";
        } else {
          return "";
        }
      case "password":
        if (!value) {
          return "Password is required";
        } else if (value.length < 8 || value.length > 15) {
          return "Please fill at least 8 character";
        } else if (!value.match(/[a-z]/g)) {
          return "Please enter at least lower character.";
        } else if (!value.match(/[A-Z]/g)) {
          return "Please enter at least upper character.";
        } else if (!value.match(/[0-9]/g)) {
          return "Please enter at least one digit.";
        } else {
          return "";
        }
      case "confirm_password":
        if (!value) {
          return "Confirm password required";
        } else if (value !== fields.password) {
          return "New password and confirm password must be same";
        } else {
          return "";
        }
      default: {
        return "";
      }
    }
  };

  handleUserInput = (e) => {
    this.setState({
      errors: {
        ...this.state.errors,
        [e.target.name]: this.validate(e.target.name, e.target.value)
      },
      fields: {
        ...this.state.fields,
        [e.target.name]: e.target.value
      }
    });
  };

  handleSubmit = (e) => {
    const { fields } = this.state;
    e.preventDefault();
    let validationErrors = {};
    Object.keys(fields).forEach((name) => {
      const error = this.validate(name, fields[name]);
      if (error && error.length > 0) {
        validationErrors[name] = error;
      }
    });
    if (Object.keys(validationErrors).length > 0) {
      this.setState({ errors: validationErrors });
      return;
    }
    if (fields.first_name && fields.email && fields.password && fields.mobile) {
      const data = {
        first_name: fields.first_name,
        email: fields.email,
        password: fields.password,
        mobile: fields.mobile
      };
      window.alert("Submit success", JSON.stringify(data));
    }
  };

  render() {
    const { fields, errors } = this.state;

    return (
      <form name="form" className="contacts_form">
        <div className="border">
          <div>
            <div>
              <div>
                <label htmlFor="gender">Choose a gender:</label>
                <select name="gender" id="gender">
                  <option value="select" checked>
                    select
                  </option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                </select>
              </div>
              <label>First name:</label>
              <input
                type="text"
                name="first_name"
                value={fields.first_name}
                onChange={(event) => this.handleUserInput(event)}
                placeholder="First Name"
              />
            </div>
            <div>
              <span className="text-danger">{errors.first_name}</span>
            </div>
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={fields.email}
              onChange={(event) => this.handleUserInput(event)}
              placeholder="Email address"
            />
            <div>
              <span className="text-danger">{errors.email}</span>
            </div>
          </div>
          <div>
            <label>Mobile:</label>
            <input
              name="mobile"
              value={fields.mobile}
              onChange={(event) => this.handleUserInput(event)}
              placeholder="Mobile"
            />
            <div>
              <span className="text-danger">{errors.mobile}</span>
            </div>
          </div>
          <div>
            <label>Password:</label>
            <input
              type="Password"
              name="password"
              value={fields.password}
              onChange={(event) => this.handleUserInput(event)}
              placeholder="Password"
            />
            <div>
              <span className="text-danger">{errors.password}</span>
            </div>
          </div>
          <div>
            <label>Confirm Password:</label>
            <input
              type="Password"
              name="confirm_password"
              value={fields.confirm_password}
              onChange={(event) => this.handleUserInput(event)}
              placeholder="Confirm password"
            />
            <div>
              <span className="text-danger">{errors.confirm_password}</span>
            </div>
          </div>
        </div>
        <br />
        <button
          type="button"
          className="login-button pointer"
          onClick={this.handleSubmit}
          disabled={
            Object.values(errors).some((el) => el.length > 0) ? true : false
          }
        >
          Submit
        </button>
      </form>
    );
  }
}
export default validationInReact;
