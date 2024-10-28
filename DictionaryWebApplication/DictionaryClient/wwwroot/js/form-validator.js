// Đối tượng `Validator`
function Validator(options) {
    function getParent(element, selector) {
        try {
            while (element.parentElement) {
                if (element.parentElement.matches(selector)) {
                    return element.parentElement;
                }
                element = element.parentElement;
            }
        } catch {

        }
    }

    var selectorRules = {};

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;

        // Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];

        // Lặp qua từng rule & kiểm tra
        // Nếu có lỗi thì dừng việc kiểm
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                            formElement.querySelector(rule.selector + ':checked')
                            );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage)
                break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
    }

    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        // Khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;

            // Lặp qua từng rules và validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                try {
                    var isValid = validate(inputElement, rule);
                    if (!isValid) {
                        isFormValid = false;
                    }
                } catch {

                }
            });

            if (isFormValid) {
                // Trường hợp submit với javascript
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {

                        switch (input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }

                        return values;
                    }, {});
                    options.onSubmit(formValues);
                }
                // Trường hợp submit với hành vi mặc định
                else {
                    formElement.submit();
                }
            }
        };

        // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input, ...)
        options.rules.forEach(function (rule) {

            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function (inputElement) {
                // Xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                };

                // Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                };
            });
        });
    }
    return options;
}



// Định nghĩa rules
// Nguyên tắc của các rules:
// 1. Khi có lỗi => Trả ra message lỗi
// 2. Khi hợp lệ => Không trả ra cái gì cả (undefined)

Validator.isRequiredFloat = function (selector, message, isOn) {
    return {
        selector: selector,
        test: function (value) {
            if (isOn == 1) {
                return value.trim() ? undefined : message;
            }
            // if isOn = 0, do not perform validation and return undefined (valid)
            else {
                return undefined;
            }
        }
    };
};


Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message;
        }
    };
};


Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email';
        }
    };
};

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Password length's minimum is ${min} characters`;
        }
    };
};

Validator.minLengthAllowNull = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            if (value.trim() === '') {
                return undefined; // No validation if empty
            }
            return value.length >= min ? undefined : message || `Password length's minimum is ${min} characters`;
        }
    };
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Password does not match!';
        }
    };
};

Validator.isDigit = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var digitRegex = /^\d+$/;
            return digitRegex.test(value) ? undefined : message || 'Invalid value!';
        }
    };
};

Validator.isDigitValid = function (selector, max, message) {
    return {
        selector: selector,
        test: function (value) {
            var digitRegex = /^\d+$/;
            if (digitRegex.test(value)) {
                if (parseInt(value) < max) {
                    return undefined;  // Valid input
                } else {
                    return message || 'Value must be smaller than ' + max + '!';  // Invalid input
                }
            } else {
                return message || 'Invalid value!';
            }
        }
    };
};
Validator.isDigitFloat = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var digitRegex = /^-?\d*\.?\d+$/;
            return digitRegex.test(value) ? undefined : message || 'Invalid value!';
        }
    };
};
Validator.isPhone = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/g;
            return phoneRegex.test(value) ? undefined : message || 'Invalid phone number!';
        }
    };
};