<%@ page import="jakarta.servlet.http.HttpSession" %>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>p-easy - Make a Payment</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
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
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 2px solid #e2e8f0;
        }

        .brand-logo {
            display: flex;
            align-items: center;
            gap: 10px;
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

        .btn-logout {
            background-color: #c53030;
            color: #ffffff;
            border: none;
            padding: 10px 18px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
        }

        .btn-logout:hover {
            background-color: #9b2c2c;
        }

        h2 {
            font-size: 24px;
            color: #1a365d;
            margin-top: 0;
            margin-bottom: 20px;
        }

        /* --- Form Elements --- */
        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            font-size: 18px;
            font-weight: bold;
            color: #1a202c;
            margin-bottom: 8px;
        }

        input[type="number"] {
            width: 100%;
            padding: 16px;
            font-size: 18px;
            border: 2px solid #4a5568;
            border-radius: 8px;
            background-color: #ffffff;
            color: #000000;
        }

        input[type="number"]:focus {
            outline: none;
            border-color: #2b6cb0;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
        }

        .btn-submit {
            display: block;
            width: 100%;
            padding: 16px;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            background-color: #2b6cb0;
            color: #ffffff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 24px;
        }

        .btn-submit:hover {
            background-color: #2c5282;
        }

        .btn-back {
            display: block;
            width: 100%;
            padding: 14px;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            background-color: #edf2f7;
            color: #2d3748;
            border: 2px solid #718096;
            border-radius: 8px;
            text-decoration: none;
            margin-top: 12px;
        }

        .btn-back:hover {
            background-color: #e2e8f0;
        }

        /* --- POPUP / MODAL OVERLAY STYLING --- */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.65);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            padding: 16px;
        }

        .modal-content {
            background-color: #ffffff;
            border: 3px solid #1a365d;
            border-radius: 16px;
            padding: 32px 24px;
            max-width: 440px;
            width: 100%;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .modal-title {
            font-size: 22px;
            color: #1a202c;
            margin-bottom: 24px;
            line-height: 1.4;
        }

        .recipient-name {
            color: #2b6cb0;
            font-weight: bold;
            font-size: 26px;
            display: block;
            margin-top: 6px;
        }

        .modal-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .btn-confirm {
            background-color: #2f855a;
            color: #ffffff;
            border: none;
            padding: 16px;
            font-size: 20px;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
            width: 100%;
        }

        .btn-confirm:hover {
            background-color: #276749;
        }

        .btn-cancel {
            background-color: #edf2f7;
            color: #2d3748;
            border: 2px solid #718096;
            padding: 14px;
            font-size: 18px;
            font-weight: bold;
            border-radius: 8px;
            text-decoration: none;
            display: block;
            width: 100%;
        }

        .btn-cancel:hover {
            background-color: #e2e8f0;
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

<%
    // Check if user clicked cancel
    if ("true".equals(request.getParameter("cancel"))) {
        session.removeAttribute("name");
        request.removeAttribute("name");
    }
%>
<div class="card">
    <% if (session.getAttribute("login") != null && (Boolean) session.getAttribute("login")) { %>

    <!-- Header with Brand Logo & Logout -->
    <div class="header">
        <div class="brand-logo">
            <div class="logo-badge">P</div>
            <div class="brand-name">P-easy</div>
        </div>
        <button type="button" id="submitBtn" class="btn-logout" onclick="logout()">Log Out</button>
    </div>

    <h2>Make a Payment</h2>

    <form action="/send" method="post">
        <div class="form-group">
            <label for="amount">Payment Amount (₹)</label>
            <input type="number" id="amount" name="amount" placeholder="Enter amount to send" value="${amount}" required>
        </div>

        <div class="form-group">
            <label for="payid">Recipient Customer ID</label>
            <input type="number" id="payid" name="payid" placeholder="Enter recipient ID" value="${pid}" required>
        </div>

        <input type="submit" value="Pay Now" class="btn-submit">
        <a href="index1.jsp" class="btn-back">Cancel / Back to Home</a>
    </form>

    <!-- POPUP MODAL: Triggers automatically if ${name} is set in request/session -->
    <% if (request.getAttribute("name") != null || session.getAttribute("name") != null) { %>
    <div class="modal-overlay" id="confirmModal">
        <div class="modal-content">
            <div class="modal-title">
                Do you want to pay to
                <span class="recipient-name">${name}</span>?
            </div>

            <div class="modal-actions">
                <!-- Post action to /psend upon 'Yes' -->
                <form action="/psend" method="post">
                    <input type="submit" value="Yes, Pay Now" class="btn-confirm">
                </form>

                <a href="pay.jsp?cancel=true" class="btn-cancel">No, Cancel</a>
            </div>
        </div>
    </div>
    <% } %>

    <% } else { %>

    <!-- Logged-Out View -->
    <div class="notice-card">
        <h2 class="notice-title">Please Sign In First</h2>
        <p style="font-size: 16px; color: #4a5568; margin-bottom: 24px;">You need to log in to access the payment service.</p>
        <a href="index.jsp" class="btn-link">Go to Sign In</a>
    </div>

    <% } %>
</div>

<script>
    function logout() {
        axios.post('${pageContext.request.contextPath}/logout')
            .then(function (response) {
                window.location.href = '${pageContext.request.contextPath}/index.jsp';
            })
            .catch(function (err) {
                console.error('Logout failed:', err);
            });
    }
</script>

</body>
</html>