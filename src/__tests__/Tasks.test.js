import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../App";

describe("Tasks", () => {
  it("Select the option and check that option 'male' was selected", () => {
    render(<App />);
    userEvent.selectOptions(screen.getByRole("combobox"), "male");
    expect(screen.getByRole("option", { name: "male" }).selected).toBe(true);
  });

  it("Check that the user has filled the form except of gender select", () => {
    render(<App />);
    const first_name = screen.getByPlaceholderText("First Name");
    const email_address = screen.getByPlaceholderText("Email Address");
    const mobile = screen.getByPlaceholderText("Mobile");
    const password = screen.getByPlaceholderText("Password");
    const confirm_password = screen.getByPlaceholderText("Confirm Password");

    userEvent.type(first_name, "aswathy");
    userEvent.type(email_address, "aswathymenon4@gmail.com");
    userEvent.type(mobile, "918086278687");
    userEvent.type(password, "abc123");
    userEvent.type(confirm_password, "abc123");

    expect(first_name).toHaveDisplayValue("aswathy");
    expect(email_address).toHaveDisplayValue("aswathymenon4@gmail.com");
    expect(mobile).toHaveDisplayValue("918086278687");
    expect(password).toHaveDisplayValue("abc123");
    expect(confirm_password).toHaveDisplayValue("abc123");
    expect(screen.getByRole("combobox")).toHaveDisplayValue("select");
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  it("Check that the field 'First Name' was focused and filled with min 2 letters", () => {
    render(<App />);
    userEvent.type(screen.getByPlaceholderText(/First Name/i), "aswathy");
    expect(screen.getByPlaceholderText(/First Name/i)).toHaveFocus();
    expect(
      screen.getByPlaceholderText(/First Name/i).value.length
    ).toBeGreaterThanOrEqual(2);
  });

  it("Check that the button submit was clicked", () => {
    render(<App />);
    const submit_button = screen.getByRole("button", { name: "Submit" });
    userEvent.click(submit_button);
    expect(screen.getByText("First name is Required")).toBeInTheDocument();
    expect(submit_button).toBeDisabled();
  });

  it("Check that the form has a class", () => {
    render(<App />);
    expect(screen.getByRole("form")).toHaveClass("contacts_form");
  });

  it("Check that the labels of the form have a content", () => {
    render(<App />);
    expect(screen.getByText("Choose a gender:")).toBeInTheDocument();
    expect(screen.getByText("First name:")).toBeInTheDocument();
    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText("Mobile:")).toBeInTheDocument();
    expect(screen.getByText("Mobile:")).toBeInTheDocument();
    expect(screen.getByText("Password:")).toBeInTheDocument();
    expect(screen.getByText("Confirm Password:")).toBeInTheDocument();
  });

  it("Check that the user can open a list of the gender and doesn't choose anything", () => {
    render(<App />);
    userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "select" }).selected).toBe(true);
  });

  it("Check that the user can't to submit until fields will be correct filled", async () => {
    render(<App />);
    const first_name_input = screen.getByPlaceholderText("First Name");
    const email_address_input = screen.getByPlaceholderText("Email Address");
    const mobile_input = screen.getByPlaceholderText("Mobile");
    const password_input = screen.getByPlaceholderText("Password");
    const confirm_password_input =
      screen.getByPlaceholderText("Confirm Password");

    await userEvent.selectOptions(screen.getByRole("combobox"), "male");
    await userEvent.type(first_name_input, "aswathy");
    await userEvent.type(email_address_input, "aswathymenon4@gmail.com");
    await userEvent.type(mobile_input, "7896537890");
    await userEvent.type(password_input, "Abcd1234");
    await userEvent.type(confirm_password_input, "Abcd123");

    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();

    await userEvent.type(confirm_password_input, "4");

    expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled();
  });

  it("Check that the field 'Email' should have correct validation, haven't error message", () => {
    render(<App />);
    const button = screen.getByRole("button", { name: "Submit" });
    userEvent.click(button);
    expect(screen.getByText("Email is Required")).toBeInTheDocument();
    userEvent.type(screen.getByPlaceholderText("Email Address"), "aswathy");
    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
  });

  it("Check that all fields on the first render should be empty", () => {
    render(<App />);
    const first_name = screen.getByPlaceholderText("First Name");
    const email = screen.getByPlaceholderText("Email Address");
    const mobile = screen.getByPlaceholderText("Mobile");
    const password = screen.getByPlaceholderText("Password");
    const confirm_password = screen.getByPlaceholderText("Confirm Password");

    expect(first_name).toBeEmptyDOMElement();
    expect(email).toBeEmptyDOMElement();
    expect(mobile).toBeEmptyDOMElement();
    expect(password).toBeEmptyDOMElement();
    expect(confirm_password).toBeEmptyDOMElement();
  });
});
