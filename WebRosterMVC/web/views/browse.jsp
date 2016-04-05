<%-- 
    Document   : browseView
    Created on : Apr 1, 2016, 5:17:58 PM
    Author     : mwd5503
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script src="js/table.js"></script>
    </head>
    <body>
        <jsp:include page="navigation.jsp"/>
        <div id="rosterDiv">
            <jsp:useBean id    = "roster" 
                         type  = "Model.Roster" 
                         class = "Model.Roster"> 
            </jsp:useBean>  
            <%
                String verb = request.getMethod();

                if (!verb.equalsIgnoreCase("GET")) {
                    response.sendError(response.SC_METHOD_NOT_ALLOWED,
                            "GET requests only are allowed.");
                } // If it's a GET request, return the predictions.
                else {
                    // Object reference application has the value 
                    // pageContext.getServletContext()
                    roster.loadData(application, "/WEB-INF/data/Roster.txt");
                    out.println(roster.getStudents());
                }
            %>
        </div>
        <h1>Todo: Browse Page</h1>
        <table id="rosterTable"></table>
    </body>
</html>
