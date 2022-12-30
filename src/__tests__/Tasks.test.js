import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../App";

describe("Tasks", () => {
  it("Select the option and check that option 'male' was selected", () => {
    render(<App />);

    const el_gender_field = screen.getByRole("combobox");
    userEvent.selectOptions(el_gender_field, "male");

    expect(el_gender_field).toHaveDisplayValue("male");
  });

  it("Check that the user has filled the form except of gender select", async () => {
    render(<App />);

    const mock_values = {
      first_name: "Test",
      email: "test@demo.com",
      mobile: "1234567890",
      password: "demo_password",
    };

    const el_first_name_field = screen.getByPlaceholderText("First Name");
    await userEvent.type(el_first_name_field, mock_values.first_name);
    const el_email_field = screen.getByPlaceholderText("Email Address");
    await userEvent.type(el_email_field, mock_values.email);
    const el_mobile_field = screen.getByPlaceholderText("mobile");
    await userEvent.type(el_mobile_field, mock_values.mobile);
    const el_password_field = screen.getByPlaceholderText("confirm Password");
    await userEvent.type(el_password_field, mock_values.password);
    const el_gender_field = screen.getByRole("combobox");

    expect(el_first_name_field).toHaveDisplayValue(mock_values.first_name);
    expect(el_email_field).toHaveDisplayValue(mock_values.email);
    expect(el_mobile_field).toHaveDisplayValue(mock_values.mobile);
    expect(el_password_field).toHaveDisplayValue(mock_values.password);
    expect(el_gender_field).toHaveDisplayValue("select");
  });

  it("Check that the field 'First Name' was focused and filled with min 2 letters", async () => {
    render(<App />);

    const el_first_name_field = screen.getByPlaceholderText("First Name");

    await userEvent.type(el_first_name_field, "t");
    expect(el_first_name_field).toHaveFocus();
    expect(screen.getByText("First name is Required")).toBeInTheDocument();

    await userEvent.type(el_first_name_field, "te");
    expect(el_first_name_field).toHaveFocus();
    expect(
      screen.queryByText("First name is Required")
    ).not.toBeInTheDocument();
  });

  it("Check that the button submit was clicked", () => {
    render(<App />);

    expect(
      screen.queryByText("First name is Required")
    ).not.toBeInTheDocument();

    const el_submit_button = screen.getByRole("button", { name: "Submit" });
    userEvent.click(el_submit_button);

    expect(screen.getByText("First name is Required")).toBeInTheDocument();
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
    expect(screen.getByText("Password:")).toBeInTheDocument();
    expect(screen.getByText("Confirm Password:")).toBeInTheDocument();
  });

  it("Check that the user can open a list of the gender and doesn't choose anything", () => {
    render(<App />);

    const el_gender_field = screen.getByRole("combobox");
    userEvent.click(el_gender_field);

    expect(el_gender_field).toHaveFocus();
    expect(el_gender_field).toHaveDisplayValue("select");
  });

  it("Check that the user can't submit until fields will be correct filled", async () => {
    render(<App />);

    const el_first_name_field = screen.getByPlaceholderText("First Name");
    await userEvent.type(el_first_name_field, "t");

    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  it("Check that the field 'Email' should have correct validation, haven't error message", async () => {
    render(<App />);

    const el_email_field = screen.getByPlaceholderText("Email Address");
    await userEvent.type(el_email_field, "test value");

    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();

    await userEvent.type(el_email_field, "test@demo.com");

    expect(screen.queryByText("Email is Required")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Enter a valid email address")
    ).not.toBeInTheDocument();
  });

  it("Check that all fields on the first render should be empty", () => {
    render(<App />);

    const el_first_name_field = screen.getByPlaceholderText("First Name");
    const el_email_field = screen.getByPlaceholderText("Email Address");
    const el_mobile_field = screen.getByPlaceholderText("mobile");
    const el_password_field = screen.getByPlaceholderText("confirm Password");
    const el_gender_field = screen.getByRole("combobox");

    expect(el_first_name_field).toHaveDisplayValue("");
    expect(el_email_field).toHaveDisplayValue("");
    expect(el_mobile_field).toHaveDisplayValue("");
    expect(el_password_field).toHaveDisplayValue("");
    expect(el_gender_field).toHaveDisplayValue("select");
  });
});
