# Odin calculator

## Table of Contents

-   [Project Description](#project-description)
-   [Features](#features)
-   [Structure](#structure)
-   [Рublished Website](#published-website)

## Project Description

An interactive web calculator with a clean UI and advanced functionality, written in pure JavaScript.

## Features

-   Support for basic arithmetic operations: `+`, `−`, `×`, `÷`
-   Keyboard control support
-   Limit the input length to 18 characters
-   Adaptive font size of the display
-   Error messages:
    -   Division by zero
    -   Attempt to perform an operation without numbers
    -   Unknown operator
-   Smart header replacement in case of error and automatic recovery
-   Buttons: `0-9`, `.`, `=`, ` clear`, `backspace`
-   Behavior like a real calculator:
    -   Pressing the operator again before entering the second number changes the operator
    -   After the calculation, you can continue typing with a new operator
    -   Decimal numbers support

## Structure

-   **HTML** is created dynamically via JS
-   **JS** contains:
    -   Button event handlers
    -   Keyboard handlers
    -   Calculation logic
    -   Display management
    -   Error handling

## Рublished Website
