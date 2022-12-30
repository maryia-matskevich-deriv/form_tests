import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ValidationInReact from "../ValidationInReact";

describe("Tasks", () => {
  it("Select the option and check that option 'male' was selected", async () => {
    render(<ValidationInReact />);
    const gender_select = screen.getByRole('combobox');
    userEvent.selectOptions(gender_select, 'male');
    expect(gender_select).toHaveDisplayValue(/male/i);
  });

  it("Check that the user has filled the form except of gender select", async () => {
    render(<ValidationInReact />);
    const select_option = screen.getByRole("option", {
      name: "select",
    });
    const first_name = screen.getByPlaceholderText("First Name");
    const email_address = screen.getByPlaceholderText("Email Address");
    const mobile_number = screen.getByPlaceholderText("Mobile");
    const password = screen.getByPlaceholderText("Password");
    const confirm_password = screen.getByPlaceholderText("Confirm Password");

    await userEvent.type(first_name, "Hamza");
    await userEvent.type(email_address, "test@abc.com");
    await userEvent.type(mobile_number, "+923029199789");
    await userEvent.type(password, "Qwerty123");
    await userEvent.type(confirm_password, "Qwerty123");

    expect(first_name).toHaveDisplayValue("Hamza");
    expect(email_address).toHaveDisplayValue("test@abc.com");
    expect(mobile_number).toHaveDisplayValue("+923029199789");
    expect(screen.getAllByDisplayValue("Qwerty123")).toHaveLength(2);
    expect(select_option.selected).toBeTruthy();
  });

  it("Check that the field 'First Name' was focused and filled with min 2 letters", async () => {
    render(<ValidationInReact />);
    const first_name = screen.getByPlaceholderText("First Name");
    await userEvent.type(first_name, "H");
    expect(screen.getByText("First name is Required")).toBeInTheDocument();
    await userEvent.type(first_name, "{backspace}");
    expect(first_name).toHaveDisplayValue("");
    expect(screen.getByText("First name is Required")).toBeInTheDocument();
    await userEvent.type(first_name, "Ha");
    expect(
      screen.queryByText("First name is Required")
    ).not.toBeInTheDocument();
  });

  it("Check that the button submit was clicked", async () => {
    render(<ValidationInReact />);
    const submit_button = screen.getByRole("button", { name: "Submit" });
    await userEvent.click(submit_button);
    expect(screen.getByText("First name is Required")).toBeInTheDocument();
    expect(screen.getByText("Email is Required")).toBeInTheDocument();
    expect(screen.getByText("Mobile number is Required")).toBeInTheDocument();
    expect(screen.getByText("Password is Required")).toBeInTheDocument();
    expect(
      screen.getByText("Confirm Password Required")
    ).toBeInTheDocument();
    expect(submit_button).toBeDisabled();
  });

  it("Check that the form has a class", () => {
    render(<ValidationInReact />);
    expect(screen.getByRole("form")).toHaveClass("contacts_form");
  });

  it("Check that the labels of the form have a content", async () => {
    render(<ValidationInReact />);
    expect(screen.getByLabelText("Choose a gender:")).toHaveTextContent(
      "selectmalefemale"
    );
    expect(screen.getByText("First name:")).not.toBeEmptyDOMElement();
    expect(screen.getByText("Email:")).not.toBeEmptyDOMElement();
    expect(screen.getByText("Mobile:")).not.toBeEmptyDOMElement();
    expect(screen.getByText("Password:")).not.toBeEmptyDOMElement();
    expect(screen.getByText("Confirm Password:")).not.toBeEmptyDOMElement();
  });

  it("Check that the user can open a list of the gender and doesn't choose anything", async () => {
    render(<ValidationInReact />);
    const first_name = screen.getByPlaceholderText("First Name");
    const email_address = screen.getByPlaceholderText("Email Address");
    const mobile_number = screen.getByPlaceholderText("Mobile");
    const password = screen.getByPlaceholderText("Password");
    const confirm_password = screen.getByPlaceholderText("Confirm Password");

    await userEvent.type(first_name, "Hamza");
    await userEvent.type(email_address, "test@abc.com");
    await userEvent.type(mobile_number, "+923029199789");
    await userEvent.type(password, "Qwerty123");
    await userEvent.type(confirm_password, "Qwerty123");

    expect(first_name).toHaveDisplayValue("Hamza");
    expect(email_address).toHaveDisplayValue("test@abc.com");
    expect(mobile_number).toHaveDisplayValue("+923029199789");
    expect(screen.getAllByDisplayValue("Qwerty123")).toHaveLength(2);

    const select = screen.getByLabelText("Choose a gender:");
    const select_option = screen.getByRole("option", {
      name: "select",
    });
    expect(select_option.selected).toBeTruthy();
    await userEvent.click(select);
    expect(select).toBeVisible();

    const submit_button = screen.getByRole("button", { name: "Submit" });
    expect(submit_button).toBeEnabled();
  });

  it("Check that the user can't to submit until fields will be correct filled", async () => {
    render(<ValidationInReact />);
    const submit_button = screen.getByRole("button", { name: "Submit" });
    const first_name = screen.getByPlaceholderText("First Name");
    const email_address = screen.getByPlaceholderText("Email Address");
    const mobile_number = screen.getByPlaceholderText("Mobile");
    const password = screen.getByPlaceholderText("Password");
    const confirm_password = screen.getByPlaceholderText("Confirm Password");

    await userEvent.type(first_name, "H");
    expect(screen.getByText("First name is Required")).toBeInTheDocument();
    expect(submit_button).toBeDisabled();

    await userEvent.type(first_name, "amza");
    expect(
      screen.queryByText("First name is Required")
    ).not.toBeInTheDocument();
    expect(submit_button).toBeEnabled();

    await userEvent.type(email_address, "test");
    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
    expect(submit_button).toBeDisabled();

    await userEvent.type(email_address, "@abc.com");
    expect(
      screen.queryByText("Enter a valid email address")
    ).not.toBeInTheDocument();
    expect(submit_button).toBeEnabled();

    await userEvent.type(mobile_number, "+92302");
    expect(
      screen.getByText("Enter a valid mobile number.")
    ).toBeInTheDocument();
    expect(submit_button).toBeDisabled();

    await userEvent.type(mobile_number, "9199789");
    expect(
      screen.queryByText("Enter a valid mobile number.")
    ).not.toBeInTheDocument();
    expect(submit_button).toBeEnabled();

    await userEvent.type(password, "Qwerty");
    expect(
      screen.getByText("Please fill at least 8 character")
    ).toBeInTheDocument();
    expect(submit_button).toBeDisabled();

    await userEvent.type(password, "123");
    expect(
      screen.queryByText("Please fill at least 8 character")
    ).not.toBeInTheDocument();
    expect(submit_button).toBeEnabled();

    await userEvent.type(confirm_password, "Qwerty");
    expect(
      screen.getByText("New Password and Confirm Password Must be Same")
    ).toBeInTheDocument();
    expect(submit_button).toBeDisabled();

    await userEvent.type(confirm_password, "123");
    expect(
      screen.queryByText("New Password and Confirm Password Must be Same")
    ).not.toBeInTheDocument();
    expect(submit_button).toBeEnabled();
  });

  it("Check that the field 'Email' should have correct validation, haven't error message", async () => {
    render(<ValidationInReact />);
    const email_address = screen.getByPlaceholderText("Email Address");

    await userEvent.type(email_address, "t");
    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();

    await userEvent.type(email_address, "{backspace}");
    expect(screen.getByText("Email is Required")).toBeInTheDocument();

    await userEvent.type(email_address, "est@abc.com");
    expect(screen.queryByText("Email is Required")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Enter a valid email address")
    ).not.toBeInTheDocument();
  });

  it("Check that all fields on the first render should be empty", () => {
    render(<ValidationInReact />);
    const select_option = screen.getByRole("option", {
      name: "select",
    });
    const first_name = screen.getByPlaceholderText("First Name");
    const email_address = screen.getByPlaceholderText("Email Address");
    const mobile_number = screen.getByPlaceholderText("Mobile");
    const password = screen.getByPlaceholderText("Password");
    const confirm_password = screen.getByPlaceholderText("Confirm Password");

    expect(select_option.selected).toBeTruthy();
    expect(first_name).toBeEmptyDOMElement();
    expect(email_address).toBeEmptyDOMElement();
    expect(mobile_number).toBeEmptyDOMElement();
    expect(password).toBeEmptyDOMElement();
    expect(confirm_password).toBeEmptyDOMElement();
  });
});
