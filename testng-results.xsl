<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
<html>
<head>
    <title>TestNG XSLT Report</title>
    <style>
        body { font-family: Arial; padding: 20px; background-color: #f4f4f9; }
        h2 { color: #333; }
        table { border-collapse: collapse; width: 50%; margin: 20px 0; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: center; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
    </style>
</head>

<body>
    <h2>TestNG Results</h2>

    <table>
        <tr>
            <th>Total Tests</th>
            <th>Passed</th>
            <th>Failed</th>
            <th>Skipped</th>
        </tr>

        <tr>
            <td><xsl:value-of select="testng-results/@total"/></td>
            <td><xsl:value-of select="testng-results/@passed"/></td>
            <td><xsl:value-of select="testng-results/@failed"/></td>
            <td><xsl:value-of select="testng-results/@skipped"/></td>
        </tr>
    </table>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
