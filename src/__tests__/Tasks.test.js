import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../App";

describe("Tasks", () => {
    let select_el;
    let select_option;
    let male_option;
    let female_option;
    let first_name_input;
    let email_address_input;
    let mobile_input;
    let password_input;
    let confirm_password_input;
    let submit_btn;
    let labels_arr;
    let input_arr;

    const fillAndCheckForm = () => {
        userEvent.type(first_name_input, 'test_first_name');
        userEvent.type(email_address_input, 'test_address@test.tt');
        userEvent.type(mobile_input, '6969696996');
        userEvent.type(password_input, 'Test_password0');
        userEvent.type(confirm_password_input, 'Test_password0');
        expect(first_name_input).toHaveDisplayValue('test_first_name');
        expect(email_address_input).toHaveDisplayValue('test_address@test.tt');
        expect(mobile_input).toHaveDisplayValue('6969696996');
        expect(password_input).toHaveDisplayValue('Test_password0');
        expect(confirm_password_input).toHaveDisplayValue('Test_password0');
    }

    beforeEach(() => {
        const {container} = render(<App/>)
        select_el = screen.getByLabelText(/choose a gender:/i);
        select_option = screen.getByRole('option', {name: /select/i});
        male_option = screen.getByRole('option', {name: /^male/i});
        female_option = screen.getByRole('option', {name: /female/i});
        first_name_input = screen.getByPlaceholderText(/first name/i);
        email_address_input = screen.getByPlaceholderText(/email address/i);
        mobile_input = screen.getByPlaceholderText(/mobile/i);
        password_input = screen.getByPlaceholderText(/^password/i);
        confirm_password_input = screen.getByPlaceholderText(/confirm password/i);
        submit_btn = screen.getByRole('button');
        labels_arr = [...container.querySelectorAll('label')];
        input_arr = [...container.querySelectorAll('input')];
    })

    it("Select the option 'male' and check that it is selected", () => {
        expect(select_el.value).toBe('select');
        expect(select_option.selected).toBeTruthy();
        expect(male_option.selected).toBeFalsy();
        expect(female_option.selected).toBeFalsy();
        userEvent.selectOptions(select_el, male_option);
        expect(select_el.value).toBe('male');
        expect(select_option.selected).toBeFalsy();
        expect(male_option.selected).toBeTruthy();
        expect(female_option.selected).toBeFalsy();
    });

    it("Check that the user has filled up the form except of gender select input", () => {
        expect(select_el.value).toBe('select');
        fillAndCheckForm();
    });

    it("Check that the field 'First Name' was focused and filled up with min 2 letters", () => {
        userEvent.type(first_name_input, 'test_first_name');
        expect(first_name_input).toHaveFocus();
        expect(first_name_input.value.length).toBeGreaterThanOrEqual(2);
    });

    it("Check that the submit button is clicked", () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation();
        expect(alertMock).not.toHaveBeenCalled();
        fillAndCheckForm();
        userEvent.click(submit_btn);
        expect(alertMock).toHaveBeenCalled();
    });

    it("Check that the form has the class", () => {
        expect(screen.getByRole('form')).toHaveClass('contacts_form');
    });

    it("Check that the labels of the form have a content", () => {
        labels_arr.forEach(el => expect(el).not.toBeEmptyDOMElement());
    });

    it("Check that the user is able to open the gender list and choose nothing", () => {
        expect(select_el.value).toBe('select');
        expect(select_el).not.toHaveFocus();
        userEvent.click(select_el);
        expect(select_el).toHaveFocus();
        expect(select_el.value).toBe('select');
        userEvent.click(document.body);
        expect(select_el.value).toBe('select');
        expect(select_el).not.toHaveFocus();
    });

    it("Check that the user can't submit the form until fields are correctly filled", () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation();
        const confirm_password_error_msg = 'New password and confirm password must be same';
        fillAndCheckForm();
        expect(screen.queryByText(confirm_password_error_msg)).not.toBeInTheDocument();
        expect(submit_btn).toBeEnabled();
        userEvent.type(confirm_password_input, 'Test_password');
        expect(screen.getByText(confirm_password_error_msg)).toBeInTheDocument();
        userEvent.click(submit_btn);
        expect(alertMock).not.toHaveBeenCalled();
        expect(submit_btn).toBeDisabled();
    });

    it("Check that the field 'Email' has correct validation and no error message", async () => {
        const error_msg = 'Enter a valid email address';
        expect(screen.queryByText(error_msg)).not.toBeInTheDocument();
        userEvent.type(email_address_input, 'test_address');
        expect(screen.getByText(error_msg)).toBeInTheDocument();
    });

    it("Check that all fields should be empty after the first render", () => {
        expect(input_arr.length).toBe(5);
        input_arr.forEach(input => expect(input.value).toBe(''));
    });
});
