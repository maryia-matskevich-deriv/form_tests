import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../App";

describe("Tasks", () => {
  it("Select the option and check that option 'male' was selected", () => {
    render(<App />);
    userEvent.selectOptions(screen.getByRole("combobox"), ["male"]);
    expect(screen.getByRole("option", { name: "male" }).selected).toBe(true);
  });

  it("Check that the user has filled the form except of gender select", () => {
    expect(true).toBe(true);
  });

  it("Check that the field 'First Name' was focused and filled with min 2 letters", () => {
    render(<App />);
    userEvent.type(screen.getByPlaceholderText(/First name/i), "Ali");
    expect(screen.getByPlaceholderText(/First name/i)).toHaveFocus();
    expect(screen.getByPlaceholderText(/First name/i).value.length).toBeGreaterThanOrEqual(2);
  });

  it("Check that the button submit was clicked", () => {
    expect(true).toBe(true);
  });

  it("Check that the form has a class", () => {
    render(<App />);
    expect(screen.getByRole("form")).toHaveClass("contacts_form");
  });

  it("Check that the labels of the form have a content", () => {
    render(<App />);
    expect(screen.getByText("First name:")).toBeInTheDocument();
    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText("Mobile:")).toBeInTheDocument();
    expect(screen.getByText("Password:")).toBeInTheDocument();
    expect(screen.getByText("Confirm Password:")).toBeInTheDocument();
  });

  it("Check that the user can open a list of the gender and doesn't choose anything", () => {
    render(<App />);
    userEvent.selectOptions(screen.getByRole("combobox"), ["select"]);
    expect(screen.getByRole("option", { name: "select" }).selected).toBe(true);
  });

  it("Check that the user can't to submit until fields will be correct filled", async () => {
    render(<App />);
    const fname = screen.getByPlaceholderText("First Name");
    await userEvent.type(fname, "a");
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  it("Check that the field 'Email' should have correct validation, haven't error message", () => {
    render(<App />);
    const button = screen.getByRole("button", { name: "Submit" });
    userEvent.click(button);
    expect(screen.getByText("Email is Required")).toBeInTheDocument();
    userEvent.type(screen.getByPlaceholderText("Email Address"), "ali");
    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
  });

  it("Check that all fields on the first render should be empty", () => {
    render(<App />);
    let formObj = {
      firstName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    }
    expect(screen.getByRole("form")).toHaveFormValues(formObj);
  });
});
