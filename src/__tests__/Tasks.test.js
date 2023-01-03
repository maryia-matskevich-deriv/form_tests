import React from "react";
import { fireEvent, getAllByTestId, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../App";

describe("Tasks", () => {

  it("Select the option and check that option 'male' was selected", () => {
    render(<App />);
    userEvent.selectOptions(screen.getByRole("combobox"), "male");
    expect(screen.getByRole("option", { name: "male" }).selected).toBeTruthy();
  });

  it("Check that the user has filled the form except of gender select", async () => {
    render(<App />);
    const first_name = screen.getByPlaceholderText(/first name/i);
    const email_address = screen.getByPlaceholderText(/email address/i);
    const mobile_number = screen.getByPlaceholderText(/mobile/i);
    const password = screen.getByPlaceholderText(/^password$/i);
    const confirm_password = screen.getByPlaceholderText(/confirm password/i);

    await userEvent.type(first_name, "meenu");
    await userEvent.type(email_address, "meenu@deriv.com");
    await userEvent.type(mobile_number, "123412489");
    await userEvent.type(password, "qwe123");
    await userEvent.type(confirm_password, "qwe123");

    expect(first_name).toHaveDisplayValue("meenu");
    expect(email_address).toHaveDisplayValue("meenu@deriv.com");
    expect(mobile_number).toHaveDisplayValue("123412489");
    expect(password).toHaveDisplayValue("qwe123");
    expect(confirm_password).toHaveDisplayValue("qwe123");
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();

  });

  it("Check that the field 'First Name' was focused and filled with min 2 letters", () => {
    render(<App />);
    userEvent.type(screen.getByPlaceholderText(/first name/i), "meenu");
    expect(screen.getByPlaceholderText(/first name/i)).toHaveFocus();
    expect(
      screen.getByPlaceholderText(/first name/i).value.length
    ).toBeGreaterThanOrEqual(2);
  });

  it("Check that the button submit was clicked", () => {
    render(<App />);
    const submit_button = screen.getByRole("button", { name: 'Submit' });
    userEvent.click(submit_button);
    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    expect(submit_button).toBeDisabled();
  });

  //it("Check that the form has a class", () => {
  //  render(<App />);
  //  expect(screen.getByRole("form")).toHaveClass("contacts_form");
  //});

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

  it("Check that the user can open a list of the gender and doesn't choose anything", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(
      screen.getByRole('option', { name: 'select' }).selected
    ).toBeTruthy();
  });

  it("Check that the user can't to submit until fields will be correct filled", async () => {
    render(<App />);
    const first_name = screen.getByPlaceholderText(/first name/i);
    const email_address = screen.getByPlaceholderText(/email address/i);
    const mobile_number = screen.getByPlaceholderText(/mobile/i);
    const password = screen.getByPlaceholderText(/^password$/i);
    const confirm_password = screen.getByPlaceholderText(/confirm password/i);

    await userEvent.type(first_name, "meenu");
    await userEvent.type(email_address, "meenu@d");
    await userEvent.type(mobile_number, "123412489");
    await userEvent.type(password, "qwe");
    await userEvent.type(confirm_password, "qwe");

    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  it("Check that the field 'Email' should have correct validation, haven't error message", () => {
    render(<App />);

    const button = screen.getByRole("button", { name: "Submit" });
    userEvent.click(button);

    expect(screen.getByText("Email is Required")).toBeInTheDocument();

    userEvent.type(screen.getByPlaceholderText("Email Address"), "meenu@d");

    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
  });

  it("Check that all fields on the first render should be empty", () => {
    render(<App />);

    const first_name = screen.getByPlaceholderText(/first name/i);
    const email_address = screen.getByPlaceholderText(/email address/i);
    const mobile_number = screen.getByPlaceholderText(/mobile/i);
    const password = screen.getByPlaceholderText(/^password$/i);
    const confirm_password = screen.getByPlaceholderText(/confirm password/i);

    expect(first_name).toBeEmptyDOMElement();
    expect(email_address).toBeEmptyDOMElement();
    expect(mobile_number).toBeEmptyDOMElement();
    expect(password).toBeEmptyDOMElement();
    expect(confirm_password).toBeEmptyDOMElement();
  });
});
