package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.io.*;
import java.util.*;

public final class Roster_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List<String> _jspx_dependants;

  private org.glassfish.jsp.api.ResourceInjector _jspx_resourceInjector;

  public java.util.List<String> getDependants() {
    return _jspx_dependants;
  }

  public void _jspService(HttpServletRequest request, HttpServletResponse response)
        throws java.io.IOException, ServletException {

    PageContext pageContext = null;
    HttpSession session = null;
    ServletContext application = null;
    ServletConfig config = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;

    try {
      response.setContentType("text/html;charset=UTF-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;
      _jspx_resourceInjector = (org.glassfish.jsp.api.ResourceInjector) application.getAttribute("com.sun.appserv.jsp.resource.injector");

      out.write("\r\n");
      out.write("<!DOCTYPE html>\r\n");
      out.write("\r\n");
      out.write("<html>\r\n");
      out.write("    <head>\r\n");
      out.write("        <title>Predictions Web Services</title>\r\n");
      out.write("    <script src=\"http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js\"></script>\r\n");
      out.write("    <script type=\"text/javascript\">\r\n");
      out.write("            var content;\r\n");
      out.write("            \r\n");
      out.write("            /**\r\n");
      out.write("            * Sorts all of the elements using the sorting function and returns a\r\n");
      out.write("            * regular array of the sorted elements.\r\n");
      out.write("            * \r\n");
      out.write("            * @param {type} sortFunction the function to use to sort the elements.\r\n");
      out.write("            * @returns {Array} an array of the sorted elements. Not a jQuery object.\r\n");
      out.write("            */\r\n");
      out.write("           $.prototype.sortElements = function(sortFunction) {\r\n");
      out.write("               // Sort the array using the given function.\r\n");
      out.write("               return $.makeArray(this).sort(sortFunction);\r\n");
      out.write("           }\r\n");
      out.write("    \r\n");
      out.write("            window.onload = function(){\r\n");
      out.write("                //JSP compiler adds an empty line before the xml content.\r\n");
      out.write("                //we manually remove it.\r\n");
      out.write("\t        content = $.trim($('#rosterDiv').html());\r\n");
      out.write("                //now remove the div element that is no longer needed\r\n");
      out.write("                $('#rosterDiv').remove();\r\n");
      out.write("                // parse the xml\r\n");
      out.write("                content = $.parseXML(content);\r\n");
      out.write("\r\n");
      out.write("                DrawTable(0);\r\n");
      out.write("            };\r\n");
      out.write("        \r\n");
      out.write("        function DrawTable(sortIndex) {\r\n");
      out.write("            if (!window.lastSortIndex) {\r\n");
      out.write("                window.lastSortIndex = -1 * sortIndex;\r\n");
      out.write("            }\r\n");
      out.write("            \r\n");
      out.write("            // Clear the table's current contents.\r\n");
      out.write("            $(\"#rosterTable\").html(\"\");\r\n");
      out.write("            \r\n");
      out.write("            // Add all of the table's headers.\r\n");
      out.write("            $(content).find('object').slice(0, 1).each(function(index, element) {\r\n");
      out.write("                // Add a row to the table.\r\n");
      out.write("                var row = document.createElement('TR');\r\n");
      out.write("                $(\"#rosterTable\").append(row);\r\n");
      out.write("                \r\n");
      out.write("                console.log(\"hello\");\r\n");
      out.write("                \r\n");
      out.write("                // Iterate through each element in the object.\r\n");
      out.write("                $(element).find('string').each(function(index, element) {\r\n");
      out.write("                    // Add a header to the row.\r\n");
      out.write("                    var header = document.createElement('TH');\r\n");
      out.write("                    header.innerHTML = $(element).text();\r\n");
      out.write("                    row.appendChild(header);\r\n");
      out.write("                });\r\n");
      out.write("            });\r\n");
      out.write("            \r\n");
      out.write("            // Add all of the students to the table.\r\n");
      out.write("            $(content).find('object').slice(1)\r\n");
      out.write("              // Sort all of the objects.\r\n");
      out.write("              .sortElements(function(a, b) { \r\n");
      out.write("                  // Retrieve each of the elements' strings corresponding to\r\n");
      out.write("                  // the passed index.\r\n");
      out.write("                  var valueA = $($(a).find('string')[sortIndex]).text();\r\n");
      out.write("                  var valueB = $($(b).find('string')[sortIndex]).text();\r\n");
      out.write("                  \r\n");
      out.write("                  // Check if the values are numbers.\r\n");
      out.write("                  if (parseInt(valueA) === parseInt(valueA))\r\n");
      out.write("                      valueA = parseInt(valueA);\r\n");
      out.write("                  if (parseInt(valueB) === parseInt(valueB))\r\n");
      out.write("                      valueB = parseInt(valueB);\r\n");
      out.write("                  \r\n");
      out.write("                  if (lastSortIndex === sortIndex) {\r\n");
      out.write("                      return valueB > valueA ? 1 : -1;\r\n");
      out.write("                  }\r\n");
      out.write("                  \r\n");
      out.write("                  return valueA > valueB ? 1 : -1;\r\n");
      out.write("              })\r\n");
      out.write("              // now we can play with each <object>\r\n");
      out.write("              .forEach(function(element, index){\r\n");
      out.write("                // Add a row or header to the table.\r\n");
      out.write("                var row = document.createElement('TR');\r\n");
      out.write("                $(\"#rosterTable\").append(row);\r\n");
      out.write("\r\n");
      out.write("                // Iterate through each string in the student object..\r\n");
      out.write("                $(element)\r\n");
      out.write("                    .find('string')\r\n");
      out.write("                    .each(function(index, element) {\r\n");
      out.write("                        // Add a column to the table row.\r\n");
      out.write("                        var column = document.createElement('TD');\r\n");
      out.write("                        column.innerHTML = $(element).text();\r\n");
      out.write("                        row.appendChild(column);                 \r\n");
      out.write("                    });\r\n");
      out.write("            });\r\n");
      out.write("            \r\n");
      out.write("            // Add listeners for each of the headers.\r\n");
      out.write("            $('TH').each(function(index, element) {\r\n");
      out.write("               element.style.cursor = \"pointer\";\r\n");
      out.write("               element.onclick = function() {\r\n");
      out.write("                   // Sort the table by the clicked header.\r\n");
      out.write("                   DrawTable(index);\r\n");
      out.write("               };\r\n");
      out.write("            });\r\n");
      out.write("            \r\n");
      out.write("            lastSortIndex = lastSortIndex == sortIndex ? -1 : sortIndex;\r\n");
      out.write("        }\r\n");
      out.write("            </script>\r\n");
      out.write("            <style>\r\n");
      out.write("                table {\r\n");
      out.write("                    border-collapse: collapse;\r\n");
      out.write("                    border: solid 2px black;\r\n");
      out.write("                    text-align: center;\r\n");
      out.write("                    margin-left: auto;\r\n");
      out.write("                    margin-right: auto;\r\n");
      out.write("                }\r\n");
      out.write("\r\n");
      out.write("                td {\r\n");
      out.write("                    border: solid 2px black\r\n");
      out.write("                }\r\n");
      out.write("\r\n");
      out.write("                th {\r\n");
      out.write("                    font-style: italic;\r\n");
      out.write("                    background-color: #FF5722;\r\n");
      out.write("                    color: white;\r\n");
      out.write("                }\r\n");
      out.write("            </style>\r\n");
      out.write("    </head>\r\n");
      out.write("    <body>\r\n");
      out.write("        <div id=\"rosterDiv\">\r\n");
      out.write("            ");
      roster.Roster roster = null;
      synchronized (_jspx_page_context) {
        roster = (roster.Roster) _jspx_page_context.getAttribute("roster", PageContext.PAGE_SCOPE);
        if (roster == null){
          roster = new roster.Roster();
          _jspx_page_context.setAttribute("roster", roster, PageContext.PAGE_SCOPE);
          out.write(" \r\n");
          out.write("            ");
        }
      }
      out.write("  \r\n");
      out.write("              ");
 
                 String verb = request.getMethod();

                 if (!verb.equalsIgnoreCase("GET")) {
                   response.sendError(response.SC_METHOD_NOT_ALLOWED,
                                      "GET requests only are allowed.");
                 }
                 // If it's a GET request, return the predictions.
                 else {
                   // Object reference application has the value 
                   // pageContext.getServletContext()
                   roster.loadData(application, "/WEB-INF/data/Roster.txt");
                   out.println(roster.getStudents());
                 }
              
      out.write("\r\n");
      out.write("        </div>\r\n");
      out.write("        <table id=\"rosterTable\">\r\n");
      out.write("        </table>\r\n");
      out.write("    </body>\r\n");
      out.write("</html>\r\n");
    } catch (Throwable t) {
      if (!(t instanceof SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          out.clearBuffer();
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
        else throw new ServletException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
