# ExpenseFilter

An intuitive and simple web application designed to help you **filter and analyze your financial expenses** based on categories from a standard CSV file.

---

## 🚀 Features

**ExpenseFilter** allows you to quickly:

1.  **Upload** your expense data from a CSV file.
2.  **Filter** expenses instantly by specific categories.
3.  **Download** the filtered data as a new CSV file for further analysis or record-keeping.

---

## 🛠 Installation & Setup

To get a local copy up and running, follow these simple steps.

### Prerequisites

You must have **Node.js** and **npm** installed on your system.

### Installation

1.  Open your terminal in the root directory of the project.
2.  Install the necessary dependencies:

    ```bash
    npm install
    ```

3.  Start the application in development mode:

    ```bash
    npm run dev
    ```

The application should now be running locally.

---

## 📝 How to Use

1.  **Upload Your CSV File:** Click the upload button and select your expense data file.
2.  **Filter Data:** Use the provided controls to select the specific **category** you want to view.
3.  **Download Results:** Click the download button to save the filtered dataset to your device.

---

## 📊 CSV File Requirements

For the application to parse your data correctly, your CSV file must adhere to the following constraints:

- **Header Row:** The file **must** include a header row specifying column names.
- **Data Content:** The file **cannot be empty** and must contain expense records.
- **Required Columns:** It **must** contain columns for both **category** and **amount**. The names of these columns can be configured (see Configuration).

---

## ⚙️ Configuration

You can customize core parsing and display settings by modifying the `config.ts` file.

| Variable         | Description                                                                                           | Default Value |
| :--------------- | :---------------------------------------------------------------------------------------------------- | :------------ |
| `categoryColumn` | The name of the column used for expense categorization.                                               | `'category'`  |
| `amountColumn`   | The name of the column containing the expense monetary value.                                         | `'amount'`    |
| `locale`         | Localization string used for formatting the currency number (e.g., decimal and thousands separators). | `'en-US'`     |
| `currency`       | The currency code (e.g., USD, EUR) to display alongside the amount.                                   | `'USD'`       |

---

## 🌐 Live Demo

Check out the application in action:

[https://expense-filter-kappa.vercel.app/](https://expense-filter-kappa.vercel.app/)
