<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>p-easy - Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="./sc.js"></script>
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

        .dashboard-card {
            width: 100%;
            max-width: 500px;
            background-color: #ffffff;
            border: 2px solid #1a365d;
            border-radius: 12px;
            padding: 28px;
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

        .user-welcome {
            font-size: 22px;
            font-weight: bold;
            color: #1a365d;
            margin: 0;
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

        /* --- Balance Card & SVG Toggle Button --- */
        .balance-card {
            background-color: #1a365d;
            color: #ffffff;
            border-radius: 14px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 4px 12px rgba(26, 54, 93, 0.25);
            border: 2px solid #2b6cb0;
        }

        .balance-label {
            font-size: 16px;
            font-weight: bold;
            color: #cbd5e0;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
        }

        .balance-display-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
        }

        .balance-amount {
            font-size: 32px;
            font-weight: 800;
            letter-spacing: 1px;
            color: #ffffff;
        }

        .toggle-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background-color: #2b6cb0;
            color: #ffffff;
            border: 2px solid #63b3ed;
            border-radius: 30px;
            padding: 10px 18px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            user-select: none;
            transition: all 0.2s ease-in-out;
        }

        .toggle-btn:hover {
            background-color: #3182ce;
            transform: translateY(-1px);
        }

        .toggle-btn:active {
            transform: translateY(1px);
        }

        .eye-svg {
            width: 22px;
            height: 22px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        /* Hide raw browser checkbox */
        .toggle-checkbox {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
        }

        /* Active state styles */
        .toggle-checkbox:checked + .toggle-btn {
            background-color: #2f855a;
            border-color: #68d391;
        }

        .toggle-checkbox:focus + .toggle-btn {
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.6);
        }

        /* --- Action Navigation Cards --- */
        .action-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .action-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #ebf8ff;
            border: 2px solid #2b6cb0;
            border-radius: 10px;
            padding: 20px;
            text-decoration: none;
            color: #2b6cb0;
            font-size: 20px;
            font-weight: bold;
            transition: background-color 0.2s;
        }

        .action-card:hover {
            background-color: #bee3f8;
        }

        .action-icon {
            font-size: 24px;
        }

        /* --- Access Denied View --- */
        .notice-card {
            text-align: center;
            padding: 24px;
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
</head>
<body>
<% System.out.println((boolean)session.getAttribute("login")); %>
<% if (session.getAttribute("login") != null && (Boolean) session.getAttribute("login")) { %>

<div class="dashboard-card">


    <!-- Header Section with p-easy Logo & Logout -->
    <div class="header">
        <div class="brand-logo">
            <div class="logo-badge">P</div>
            <div class="brand-name">P-easy</div>
        </div>
        <button type="button" id="submitBtn" class="btn-logout" onclick="logout()">Log Out</button>
    </div>

    <!-- User Welcome Greeting -->
    <h2 class="user-welcome" style="margin-bottom: 20px;">Hello, ${username}</h2>

    <!-- Available Balance Card with SVG Eye Toggle -->
    <div class="balance-card">
        <div class="balance-label">Available Balance</div>
        <div class="balance-display-row">
            <div id="amount" class="balance-amount">₹ ******</div>

            <label for="check" style="margin: 0; cursor: pointer;">
                <input type="checkbox" id="check" class="toggle-checkbox" onchange="changeBalance()">
                <span class="toggle-btn" id="toggleBtn">

                    <!-- Eye Open SVG (Shown when hidden) -->
                    <svg id="eyeOpenSvg" class="eye-svg" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>

                    <!-- Eye Closed SVG (Shown when revealed) -->
                    <svg id="eyeClosedSvg" class="eye-svg" viewBox="0 0 24 24" style="display: none;">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>

                    <span id="btnText">Show</span>
                </span>
            </label>
        </div>
    </div>

    <!-- Action Navigation Links -->
    <div class="action-list">
        <a href="pay.jsp" class="action-card">
            <span> Make a Payment</span>
            <span class="action-icon">➔</span>
        </a>

        <a href="transh.jsp" class="action-card">
            <span>View Transaction History</span>
            <span class="action-icon">➔</span>
        </a>
    </div>

    <% } else { %>

    <!-- Logged-Out / Access Denied View -->
    <div class="notice-card">
        <h2 class="notice-title">Please Sign In First</h2>
        <p style="font-size: 16px; color: #4a5568; margin-bottom: 24px;">You need to log in to access your banking dashboard.</p>
        <a href="index.jsp" class="btn-link">Go to Sign In</a>
    </div>

    <% } %>
</div>

<script>
    function changeBalance() {
        var isChecked = document.getElementById("check").checked;
        var amountElem = document.getElementById("amount");
        var btnText = document.getElementById("btnText");
        var eyeOpenSvg = document.getElementById("eyeOpenSvg");
        var eyeClosedSvg = document.getElementById("eyeClosedSvg");

        if (isChecked) {
            amountElem.innerHTML = "₹ " + Number(${useramount}).toLocaleString('en-IN', { minimumFractionDigits: 2 });
            btnText.innerText = "Hide";
            eyeOpenSvg.style.display = "none";
            eyeClosedSvg.style.display = "inline";
        } else {
            amountElem.innerHTML = "₹ ******";
            btnText.innerText = "Show";
            eyeOpenSvg.style.display = "inline";
            eyeClosedSvg.style.display = "none";
        }
    }

    function logout() {
        axios.post('${pageContext.request.contextPath}/logout')
            .then(function (response) {
                sessionStorage.clear();
                localStorage.clear();
                window.location.replace('${pageContext.request.contextPath}/index.jsp');
            })
            .catch(function (err) {
                console.error('Logout failed:', err);
            });
    }
</script>

</body>
</html>