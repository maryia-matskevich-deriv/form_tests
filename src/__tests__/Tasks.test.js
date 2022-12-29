import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ValidationInReact from "../ValidationInReact";

describe("Tasks", () => {
  it("Select the option 'male' and check this option was selected", async () => {
    render(<ValidationInReact />);
    const select = screen.getByLabelText("Choose a gender:");
    const male_option = screen.getByRole("option", {
      name: "male",
    });
    await userEvent.selectOptions(select, male_option);
    expect(male_option.selected).toBeTruthy();
  });

  it("Check that the user has filled the form except for gender select", async () => {
    render(<ValidationInReact />);
    const select_option = screen.getByRole("option", {
      name: "select",
    });
    const first_name = screen.getByPlaceholderText("First Name");
    const email = screen.getByPlaceholderText("Email Address");
    const mobile_number = screen.getByPlaceholderText("Mobile");
    const password = screen.getByPlaceholderText("Password");
    const confirm_password = screen.getByPlaceholderText("Confirm Password");

    await userEvent.type(first_name, "Mary");
    await userEvent.type(email, "abc@gmail.com");
    await userEvent.type(mobile_number, "+375331111100");
    await userEvent.type(password, "Abcd4325");
    await userEvent.type(confirm_password, "Abcd4325");

    expect(first_name).toHaveDisplayValue("Mary");
    expect(email).toHaveDisplayValue("abc@gmail.com");
    expect(mobile_number).toHaveDisplayValue("+375331111100");
    expect(screen.getAllByDisplayValue("Abcd4325")).toHaveLength(2);
    expect(select_option.selected).toBeTruthy();
  });

  it("Check that the field 'First Name' was focused and filled with min 2 letters", async () => {
    render(<ValidationInReact />);
    const first_name = screen.getByPlaceholderText("First Name");
    await userEvent.type(first_name, "A");
    expect(screen.getByText("First name is Required")).toBeInTheDocument();
    await userEvent.type(first_name, "{backspace}");
    expect(first_name).toHaveDisplayValue("");
    expect(screen.getByText("First name is Required")).toBeInTheDocument();
    await userEvent.type(first_name, "Al");
    expect(
      screen.queryByText("First name is Required")
    ).not.toBeInTheDocument();
  });

  it("Check that the Submit button was clicked", async () => {
    render(<ValidationInReact />);
    const submit_button = screen.getByRole("button", { name: "Submit" });
    await userEvent.click(submit_button);
    expect(screen.getByText("First name is Required")).toBeInTheDocument();
    expect(screen.getByText("Email is Required")).toBeInTheDocument();
    expect(screen.getByText("Mobile number is Required")).toBeInTheDocument();
    expect(screen.getByText("Password is Required")).toBeInTheDocument();
    expect(
      screen.getByText("Confirm Password is Required")
    ).toBeInTheDocument();
    expect(submit_button).toBeDisabled();
  });

  it("Check that the form has a class", () => {
    render(<ValidationInReact />);
    expect(screen.getByRole("form")).toHaveClass("contacts_form");
  });

  it("Check that the labels of the form have content", async () => {
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
    const email = screen.getByPlaceholderText("Email Address");
    const mobile_number = screen.getByPlaceholderText("Mobile");
    const password = screen.getByPlaceholderText("Password");
    const confirm_password = screen.getByPlaceholderText("Confirm Password");

    await userEvent.type(first_name, "Mary");
    await userEvent.type(email, "abc@gmail.com");
    await userEvent.type(mobile_number, "+375331111100");
    await userEvent.type(password, "Abcd4325");
    await userEvent.type(confirm_password, "Abcd4325");

    expect(first_name).toHaveDisplayValue("Mary");
    expect(email).toHaveDisplayValue("abc@gmail.com");
    expect(mobile_number).toHaveDisplayValue("+375331111100");
    expect(screen.getAllByDisplayValue("Abcd4325")).toHaveLength(2);

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

  it("Check that the user can't submit until fields will be correct filled", async () => {
    render(<ValidationInReact />);
    const submit_button = screen.getByRole("button", { name: "Submit" });
    const first_name = screen.getByPlaceholderText("First Name");
    const email = screen.getByPlaceholderText("Email Address");
    const mobile_number = screen.getByPlaceholderText("Mobile");
    const password = screen.getByPlaceholderText("Password");
    const confirm_password = screen.getByPlaceholderText("Confirm Password");

    await userEvent.type(first_name, "M");
    expect(screen.getByText("First name is Required")).toBeInTheDocument();
    expect(submit_button).toBeDisabled();

    await userEvent.type(first_name, "ary");
    expect(
      screen.queryByText("First name is Required")
    ).not.toBeInTheDocument();
    expect(submit_button).toBeEnabled();

    await userEvent.type(email, "abc");
    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
    expect(submit_button).toBeDisabled();

    await userEvent.type(email, "@gmail.com");
    expect(
      screen.queryByText("Enter a valid email address")
    ).not.toBeInTheDocument();
    expect(submit_button).toBeEnabled();

    await userEvent.type(mobile_number, "+37533");
    expect(
      screen.getByText("Enter a valid mobile number.")
    ).toBeInTheDocument();
    expect(submit_button).toBeDisabled();

    await userEvent.type(mobile_number, "1111100");
    expect(
      screen.queryByText("Enter a valid mobile number.")
    ).not.toBeInTheDocument();
    expect(submit_button).toBeEnabled();

    await userEvent.type(password, "Abcd");
    expect(
      screen.getByText("Please fill at least 8 characters")
    ).toBeInTheDocument();
    expect(submit_button).toBeDisabled();

    await userEvent.type(password, "4325");
    expect(
      screen.queryByText("Please fill at least 8 characters")
    ).not.toBeInTheDocument();
    expect(submit_button).toBeEnabled();

    await userEvent.type(confirm_password, "Abcd");
    expect(
      screen.getByText("New Password and Confirm Password Must be Same")
    ).toBeInTheDocument();
    expect(submit_button).toBeDisabled();

    await userEvent.type(confirm_password, "4325");
    expect(
      screen.queryByText("New Password and Confirm Password Must be Same")
    ).not.toBeInTheDocument();
    expect(submit_button).toBeEnabled();
  });

  it("Check that the field 'Email' is validated correctly and there is no error message", async () => {
    render(<ValidationInReact />);
    const email = screen.getByPlaceholderText("Email Address");

    await userEvent.type(email, "a");
    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();

    await userEvent.type(email, "{backspace}");
    expect(screen.getByText("Email is Required")).toBeInTheDocument();

    await userEvent.type(email, "bc@gmail.com");
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
    const email = screen.getByPlaceholderText("Email Address");
    const mobile_number = screen.getByPlaceholderText("Mobile");
    const password = screen.getByPlaceholderText("Password");
    const confirm_password = screen.getByPlaceholderText("Confirm Password");

    expect(select_option.selected).toBeTruthy();
    expect(first_name).toBeEmptyDOMElement();
    expect(email).toBeEmptyDOMElement();
    expect(mobile_number).toBeEmptyDOMElement();
    expect(password).toBeEmptyDOMElement();
    expect(confirm_password).toBeEmptyDOMElement();
  });
});
