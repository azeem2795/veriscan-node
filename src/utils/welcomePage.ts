const welcomePage = `<!DOCTYPE html>
<html>
<head>
    <title>Welcome</title>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            padding: 0;
@@ -30,18 +29,22 @@ const welcomePage = `<!DOCTYPE html>
        .Hero-logo {
            height: 40vmin;
            pointer-events: none;
            margin-bottom: 10px;
        }
        @media (prefers-reduced-motion: no-preference) {
            .Hero-logo {
                animation: Hero-logo-spin infinite 20s linear;
            }
        }
        .Hero-header {
            background-color: #282c34;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
@@ -53,16 +56,17 @@ const welcomePage = `<!DOCTYPE html>
        .Hero-header p {
            font-size: 20px;
            line-height: 2.5;
        }
        @keyframes Hero-logo-spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
    </style>
</head>
@@ -71,13 +75,15 @@ const welcomePage = `<!DOCTYPE html>
    <div class="Hero">
        <header class="Hero-header">
            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968322.png" class="Hero-logo" alt="logo" />
            <h4>Welcome to ${APP_NAME}</h4>
            <p>This is the main route of the application.</p>
        </header>
    </div>
</div>
</body>
</html>
`;

export default welcomePage;
