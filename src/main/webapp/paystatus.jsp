<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>p-easy - Transaction Status</title>
    <style>
        * {
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
        }

        body {
            background-color: #f0f4f8;
            margin: 0;
            padding: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .card {
            width: 100%;
            max-width: 500px;
            background-color: #ffffff;
            border: 2px solid #1a365d;
            border-radius: 12px;
            padding: 32px 24px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* --- Header & Logo Styling --- */
        .brand-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 2px solid #e2e8f0;
        }

        .logo-badge {
            background-color: #2b6cb0;
            color: #ffffff;
            font-size: 22px;
            font-weight: 900;
            width: 42px;
            height: 42px;
            border-radius: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .brand-name {
            font-size: 26px;
            font-weight: 800;
            color: #1a365d;
        }

        /* --- Status Message --- */
        .status-msg {
            font-size: 22px;
            font-weight: bold;
            color: #2b6cb0;
            text-align: center;
            margin-bottom: 24px;
            padding: 12px;
            background-color: #ebf8ff;
            border-radius: 8px;
            border: 1px solid #bee3f8;
        }

        /* --- Transaction Details Card --- */
        .details-container {
            background-color: #f7fafc;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 28px;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px dashed #cbd5e0;
        }

        .detail-row:last-child {
            border-bottom: none;
        }

        .detail-label {
            font-size: 18px;
            color: #4a5568;
            font-weight: bold;
        }

        .detail-value {
            font-size: 20px;
            color: #1a202c;
            font-weight: bold;
        }

        .amount-value {
            color: #2f855a;
            font-size: 24px;
        }

        /* --- Buttons --- */
        .btn-home {
            display: block;
            width: 100%;
            padding: 16px;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            background-color: #2b6cb0;
            color: #ffffff;
            border-radius: 8px;
            text-decoration: none;
        }

        .btn-home:hover {
            background-color: #2c5282;
        }

        /* --- Access Denied State --- */
        .notice-card {
            text-align: center;
            padding: 12px;
        }

        .notice-title {
            font-size: 22px;
            color: #c53030;
            margin-bottom: 16px;
        }

        .btn-link {
            display: inline-block;
            background-color: #2b6cb0;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 28px;
            font-size: 18px;
            font-weight: bold;
            border-radius: 8px;
        }
    </style>
    <script src ="./sc.js"></script>
</head>
<body>

<div class="card">
    <% if (session.getAttribute("login") != null && (Boolean) session.getAttribute("login")) { %>

    <!-- Brand Header -->
    <div class="brand-container">
        <div class="logo-badge">P</div>
        <div class="brand-name">P-easy</div>
    </div>

    <!-- Status Header (${msg}) -->
    <div class="status-msg">${msg}</div>

    <!-- Transaction Details -->
    <div class="details-container">
        <div class="detail-row">
            <span class="detail-label">From Account:</span>
            <span class="detail-value">${uid}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">To Recipient:</span>
            <span class="detail-value">${pid}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Amount:</span>
            <span class="detail-value amount-value">₹${amount}</span>
        </div>
    </div>

    <!-- Home Navigation -->
    <a href="index1.jsp" class="btn-home">Go Back to Home</a>

    <% } else { %>

    <!-- Logged-Out View -->
    <div class="notice-card">
        <h2 class="notice-title">Please Sign In First</h2>
        <p style="font-size: 16px; color: #4a5568; margin-bottom: 24px;">You need to log in to view transaction details.</p>
        <a href="index.jsp" class="btn-link">Go to Sign In</a>
    </div>

    <% } %>
</div>

</body>
</html>