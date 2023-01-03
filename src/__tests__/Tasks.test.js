import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../App";

describe("Testing the form", () => {
  it("Select the option and check that option 'male' was selected", () => {
    render(<App />);
    const gender_select_box = screen.getByRole("combobox");

    userEvent.selectOptions(gender_select_box, "male");

    expect(screen.getByRole("option", { name: "male" }).selected).toBe(true);
  });

  it("Check that the user has filled the form except of gender select", () => {
    render(<App />);
    const first_name_input = screen.getByLabelText("First name:");
    const email_input = screen.getByLabelText("Email:");
    const mobile_no_input = screen.getByLabelText("Mobile:");
    const password_input = screen.getByLabelText("Password:");
    const confirm_password_input = screen.getByLabelText("Confirm Password:");

    userEvent.type(first_name_input, "test_first_name");
    expect(first_name_input).toHaveDisplayValue("test_first_name");

    userEvent.type(email_input, "test_email");
    expect(email_input).toHaveDisplayValue("test_email");

    userEvent.type(mobile_no_input, "test_mobile_no");
    expect(mobile_no_input).toHaveDisplayValue("test_mobile_no");

    userEvent.type(password_input, "test_password");
    expect(password_input).toHaveDisplayValue("test_password");

    userEvent.type(confirm_password_input, "test_confirm_password");
    expect(confirm_password_input).toHaveDisplayValue("test_confirm_password");

    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  it("Check that the field 'First Name' was focused and filled with min 2 letters", async () => {
    render(<App />);
    const first_name_input = screen.getByLabelText("First name:");
    userEvent.type(first_name_input, "t");
    expect(first_name_input).toHaveDisplayValue("t");

    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    userEvent.clear(first_name_input);

    await userEvent.clear(first_name_input);

    userEvent.type(first_name_input, "test");
    expect(first_name_input).toHaveDisplayValue("test");

    expect(first_name_input.value.length).toBeGreaterThanOrEqual(2);

    await waitFor(() => {
      expect(
        screen.queryByText(/first name is required/i)
      ).not.toBeInTheDocument();
    });
  });

  it("Check that the button submit was clicked", () => {
    render(<App />);
    const gender_select_box = screen.getByRole("combobox");
    const first_name_input = screen.getByLabelText("First name:");
    const email_input = screen.getByPlaceholderText(/email address/i);
    const mobile_no_input = screen.getByPlaceholderText(/mobile/i);
    const password_input = screen.getByPlaceholderText(/^password/i);
    const confirm_password_input =
      screen.getByPlaceholderText(/^confirm password/i);

    userEvent.selectOptions(gender_select_box, "male");
    expect(screen.getByRole("option", { name: "male" }).selected).toBe(true);

    userEvent.type(first_name_input, "test_first_name");
    expect(first_name_input).toHaveDisplayValue("test_first_name");

    userEvent.type(email_input, "test_email@gmail.com");
    expect(email_input).toHaveDisplayValue("test_email@gmail.com");

    userEvent.type(mobile_no_input, "6666666666");
    expect(mobile_no_input).toHaveDisplayValue("6666666666");

    userEvent.type(password_input, "Test@12345678");
    expect(password_input).toHaveDisplayValue("Test@12345678");

    userEvent.type(confirm_password_input, "Test@12345678");
    expect(confirm_password_input).toHaveDisplayValue("Test@12345678");

    expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled();
  });

  it("Check that the form has a class", () => {
    render(<App />);
    expect(screen.getByRole("form")).toHaveClass("contacts_form");
  });

  it("Check that the labels of the form have a content", () => {
    render(<App />);
    expect(screen.getByLabelText("Choose a gender:")).toBeInTheDocument();
    expect(screen.getByLabelText("First name:")).toBeInTheDocument();
    expect(screen.getByLabelText("Email:")).toBeInTheDocument();
    expect(screen.getByLabelText("Mobile:")).toBeInTheDocument();
    expect(screen.getByLabelText("Password:")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password:")).toBeInTheDocument();
  });

  it("Check that the user can open a list of the gender and doesn't choose anything", () => {
    render(<App />);
    const gender_select_box = screen.getByRole("combobox");
    userEvent.selectOptions(gender_select_box, "select");
    expect(screen.getByRole("option", { name: "select" }).selected).toBe(true);
  });

  it("Check that the user can't to submit until fields will be correct filled", async () => {
    render(<App />);
    const gender_select_box = screen.getByRole("combobox");
    const first_name_input = screen.getByLabelText("First name:");
    const email_input = screen.getByPlaceholderText(/email address/i);
    const mobile_no_input = screen.getByPlaceholderText(/mobile/i);
    const password_input = screen.getByPlaceholderText(/^password/i);
    const confirm_password_input =
      screen.getByPlaceholderText(/^confirm password/i);

    userEvent.type(first_name_input, "t");

    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();

    userEvent.type(email_input, "test");
    expect(
      screen.getByText(/enter a valid email address/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();

    userEvent.type(mobile_no_input, "123");
    expect(
      screen.getByText(/enter a valid mobile number./i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
    userEvent.clear(mobile_no_input);

    userEvent.type(password_input, "123");
    expect(
      screen.getByText(/please fill at least 8 character/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();

    userEvent.type(password_input, "test@12345");
    userEvent.type(confirm_password_input, "test");

    expect(
      screen.getByText(/new Password and Confirm Password Must be same/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
    await userEvent.clear(password_input);
    await userEvent.clear(confirm_password_input);
    await userEvent.clear(mobile_no_input);

    // valid inputs
    userEvent.selectOptions(gender_select_box, "male");
    userEvent.type(first_name_input, "test");
    userEvent.type(email_input, "test@gmail.com");
    userEvent.type(mobile_no_input, "6666666666");
    userEvent.type(password_input, "Test@12345678");
    userEvent.type(confirm_password_input, "Test@12345678");
    expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled();
  });

  it("Check that the field 'Email' should have correct validation, haven't error message", () => {
    render(<App />);
    const email_input = screen.getByPlaceholderText(/email address/i);

    userEvent.type(email_input, "t");
    expect(
      screen.getByText(/enter a valid email address/i)
    ).toBeInTheDocument();

    userEvent.clear(email_input);
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();

    userEvent.type(email_input, "test@gmail.com");
    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/enter a valid email address/i)
    ).not.toBeInTheDocument();
  });

  it("Check that all fields on the first render should be empty", () => {
    render(<App />);
    expect(screen.getByLabelText("First name:")).not.toHaveValue();
    expect(screen.getByLabelText("Email:")).not.toHaveValue();
    expect(screen.getByLabelText("Mobile:")).not.toHaveValue();
    expect(screen.getByLabelText("Password:")).not.toHaveValue();
    expect(screen.getByLabelText("Confirm Password:")).not.toHaveValue();
  });
});
