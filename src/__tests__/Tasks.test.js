import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ValidationInReact from "../ValidationInReact";

describe("Tasks", () => {
  it("Select the option and check that option 'male' was selected", async () => {
    render(<ValidationInReact />);

    const dropdown = screen.getByLabelText("Choose a gender:");
    const male_option = screen.getByRole("option", { name: "male" });
    await userEvent.selectOptions(dropdown, "male");

    expect(male_option.selected).toBeTruthy();
  });

  it("Check that the user has filled the form except of gender select", async () => {
    render(<ValidationInReact />);

    const select_option = screen.getByRole("option", { name: "select" });

    const first_name = screen.getByPlaceholderText("First Name");
    const email_address = screen.getByPlaceholderText("Email Address");
    const mobile_number = screen.getByPlaceholderText("mobile");
    const password = screen.getByPlaceholderText("Password");
    const confirm_password = screen.getByPlaceholderText("confirm Password");

    await userEvent.type(first_name, "Ameerul");
    await userEvent.type(email_address, "123@mailinator.com");
    await userEvent.type(mobile_number, "6788765689");
    await userEvent.type(password, "abcd1234");
    await userEvent.type(confirm_password, "abcd1234");

    expect(first_name).toHaveDisplayValue("Ameerul");
    expect(email_address).toHaveDisplayValue("123@mailinator.com");
    expect(mobile_number).toHaveDisplayValue("6788765689");
    expect(screen.getAllByDisplayValue("abcd1234")).toHaveLength(2);
    expect(select_option.selected).toBeTruthy();
  });

  it("Check that the field 'First Name' was focused and filled with min 2 letters", async () => {
    render(<ValidationInReact />);

    const first_name = screen.getByPlaceholderText("First Name");
    await userEvent.type(first_name, "A");
    expect(screen.getByText("First name is required")).toBeInTheDocument();

    await userEvent.type(first_name, "Am");
    expect(screen.getByText("First name is required")).not.toBeInTheDocument();
  });

  it("Check that the button submit was clicked", async () => {
    render(<ValidationInReact />);

    const submit_button = screen.getByRole("button", { name: "Submit" });
    await userEvent.click(submit_button);

    expect(submit_button).toHaveBeenCalled();
  });

  it("Check that the form has a class", () => {
    render(<ValidationInReact />);

    expect(screen.getByRole("form")).toHaveClass("contacts_form");
  });

  it("Check that the labels of the form have a content", () => {
    render(<ValidationInReact />);

    expect(screen.getByRole("form")).not.toBeEmptyDOMElement();
  });

  it("Check that the user can open a list of the gender and doesn't choose anything", async () => {
    render(<ValidationInReact />);

    const dropdown = screen.getByLabelText("Choose a gender:");
    const select_option = screen.getByRole("option", { name: "selected" });
    await userEvent.selectOptions(dropdown, "selected");

    expect(select_option.selected).toBeTruthy();
  });

  it("Check that the user can't to click a submit until fields will be correct filled", async () => {
    render(<ValidationInReact />);

    const first_name = screen.getByPlaceholderText("First Name");
    const email_address = screen.getByPlaceholderText("Email Address");
    const mobile_number = screen.getByPlaceholderText("mobile");
    const password = screen.getByPlaceholderText("Password");
    const confirm_password = screen.getByPlaceholderText("confirm Password");
    const submit_button = screen.getByRole("button", { name: "Submit" });

    await userEvent.type(first_name, "Ameerul");
    await userEvent.type(email_address, "123@mailinator.com");
    await userEvent.type(password, "abcd1234");
    await userEvent.type(confirm_password, "abcd1234");

    expect(submit_button).toBeDisabled();

    await userEvent.type(mobile_number, "6788765689");
    expect(submit_button).not.toBeDisabled();
  });

  it("Check that the field 'Email' should have correct validation", async () => {
    render(<ValidationInReact />);
    const email_address = screen.getByPlaceholderText("Email Address");

    await userEvent.type(email_address, "ameerul");
    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();

    await userEvent.type(email_address, "ameerul@gmail");
    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();

    await userEvent.type(email_address, "ameerul@gmail.com");
    expect(
      screen.getByText("Enter a valid email address")
    ).not.toBeInTheDocument();
  });

  it("Check that all fields on the first render should be empty", () => {
    render(<ValidationInReact />);

    const first_name = screen.getByPlaceholderText("First Name");
    const email_address = screen.getByPlaceholderText("Email Address");
    const mobile_number = screen.getByPlaceholderText("mobile");
    const password = screen.getByPlaceholderText("Password");
    const confirm_password = screen.getByPlaceholderText("confirm Password");

    expect(first_name).toHaveValue("");
    expect(email_address).toHaveValue("");
    expect(mobile_number).toHaveValue("");
    expect(password).toHaveValue("");
    expect(confirm_password).toHaveValue("");
  });
});
