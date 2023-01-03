import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../App";

describe("Tasks", () => {
  const typeValues = () => {
    userEvent.type(screen.getByPlaceholderText(/first name/i), "George");
    userEvent.type(screen.getByPlaceholderText(/email/i), "george@gmail.com");
    userEvent.type(screen.getByPlaceholderText(/mobile/i), "9999999999");
    userEvent.type(screen.getByPlaceholderText(/^password$/i), "AAbbccdd1!");
    userEvent.type(
      screen.getByPlaceholderText(/^confirm password$/i),
      "AAbbccdd1!"
    );
  };

  it("Select the option and check that option 'male' was selected", () => {
    render(<App />);

    userEvent.selectOptions(screen.getByRole("combobox"), ["male"]);

    expect(screen.getByRole("option", { name: "male" }).selected).toBe(true);
  });

  it("Check that the user has filled the form except of gender select", () => {
    render(<App />);

    typeValues();

    expect(screen.getByPlaceholderText(/first name/i)).toHaveDisplayValue(
      "George"
    );
    expect(screen.getByPlaceholderText(/email/i)).toHaveDisplayValue(
      "george@gmail.com"
    );
    expect(screen.getByPlaceholderText(/mobile/i)).toHaveDisplayValue(
      "9999999999"
    );
    expect(screen.getByPlaceholderText(/^password$/i)).toHaveDisplayValue(
      "AAbbccdd1!"
    );
    expect(
      screen.getByPlaceholderText(/^confirm password$/i)
    ).toHaveDisplayValue("AAbbccdd1!");
    expect(screen.getByRole("option", { name: "select" }).selected).toBe(true);
  });

  it("Check that the field 'First Name' was focused and filled with min 2 letters", () => {
    render(<App />);

    userEvent.type(screen.getByPlaceholderText(/first name/i), "George");
    expect(screen.getByPlaceholderText(/first name/i)).toHaveFocus();
    expect(
      screen.getByPlaceholderText(/first name/i).value.length
    ).toBeGreaterThanOrEqual(2);
  });

  it("Check that the button submit was clicked", () => {
    render(<App />);

    const alertMock = jest.spyOn(window, "alert").mockImplementation();
    const submit_btn = screen.getByRole("button", { name: /submit/i });

    typeValues();

    expect(submit_btn).not.toBeDisabled();
    userEvent.click(submit_btn);
    expect(alertMock).toHaveBeenCalled();
  });

  it("Check that the form has a class", () => {
    render(<App />);

    expect(screen.getByRole("form")).toHaveClass("contacts_form");
  });

  it("Check that the labels of the form have a content", () => {
    const { container } = render(<App />);

    const labels_arr = container.querySelectorAll("label");
    labels_arr.forEach((label) => {
      expect(label).not.toBeEmptyDOMElement();
    });
  });

  it("Check that the user can open a list of the gender and doesn't choose anything", () => {
    render(<App />);

    userEvent.selectOptions(screen.getByRole("combobox"), ["select"]);
    expect(screen.getByRole("option", { name: "select" }).selected).toBe(true);
  });

  it("Check that the user can't to submit until fields will be correct filled", () => {
    render(<App />);
    const alertMock = jest.spyOn(window, "alert").mockImplementation();
    const submit_btn = screen.getByRole("button", { name: /submit/i });

    userEvent.click(submit_btn);
    expect(submit_btn).toBeDisabled();

    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/mobile number is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/confirm password required/i)).toBeInTheDocument();

    typeValues();

    expect(submit_btn).not.toBeDisabled();
    userEvent.click(submit_btn);
    expect(alertMock).toHaveBeenCalled();
  });

  it("Check that the field 'Email' should have correct validation, haven't error message", () => {
    render(<App />);

    userEvent.type(screen.getByPlaceholderText(/email/i), "georgegmail.com");
    expect(
      screen.getByText(/enter a valid email address/i)
    ).toBeInTheDocument();
    userEvent.clear(screen.getByPlaceholderText(/email/i));

    userEvent.type(screen.getByPlaceholderText(/email/i), "george@gmail.com");
    expect(
      screen.queryByText(/enter a valid email address/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
  });

  it("Check that all fields on the first render should be empty", () => {
    render(<App />);

    expect(screen.getByRole("form")).toHaveFormValues({
      firstName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    });
  });
});
