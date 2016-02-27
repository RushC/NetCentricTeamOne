// The schedule object containing all of the content.
var schedule = [
    {
        tag: "JScript",
        classes: [
            {
                num: 1,
                date: "M: 1/11",
                topic: "Introduction to Web Applications",
                project: "Topic: Course Web Application"
            },
            {
                num: 2,
                date: "W: 1/13",
                topic: "Fundamental Javascript",
                notes: "David 2-8"
            },
            {
                num: 3,
                date: "F: 1/15",
                topic: "Regular Expressions",
                notes: "David 12"
            }
        ]
    },
    {
        tag: "JScript",
        classes: [
            {
                num: 4,
                date: "W: 1/20",
                topic: "Server-Side Javascript",
                notes: "David 12"
            },
            {
                date: "F: 1/22",
                topic: "Lab 1: Node.js",
                project: "Node server",
                notes: "Quiz1",
                type: "Lab"
            }
        ]
    },
    {
        tag: "JScript",
        classes: [
            {
                num: 5,
                date: "M: 1/25",
                topic: "Javascript in Web Browsers",
                notes: "David 13"
            },
            {
                num: 6,
                date: "W: 1/27",
                topic: "Javascript: the Window object",
                notes: "David 14"
            },
            {
                date: "F: 1/29",
                topic: "Lab 2: Node.js",
                project: "Simple website",
                notes: "Quiz2",
                type: "Lab"
            }
        ]
    },
    {
        tag: "HTML & CSS",
        classes: [
            {
                num: 7,
                date: "M: 2/1",
                topic: "Scripting Document: the model",
                project: "Scripting client",
                notes: "David 15"
            },
            {
                num: 8,
                date: "W: 2/3",
                topic: "Scripting CSS: the view",
                project: "CSS design",
                notes: "David 16"
            },
            {
                date: "F: 2/5",
                topic: "Lab 3: Node.js",
                project: "Syllabus TOC",
                notes: "Quiz3",
                type: "Lab"
            }
        ]
    },
    {
        tag: "Event",
        classes: [
            {
                num: 9,
                date: "M: 2/8",
                topic: "Advanced Javascript: Event Handling",
                project: "Scripting client",
                notes: "David 17"
            },
            {
                num: 10,
                date: "W: 2/10",
                topic: "Advanced Javascript: Event Handling",
                project: "Scripting client",
                notes: "David 17"
            },
            {
                date: "F: 2/12",
                topic: "Lab 4: Node.js",
                project: "Simple Evaluation Tool",
                notes: "Quiz4",
                type: "Lab"
            }
        ]
    },
    {
        tag: "Ajax",
        classes: [
            {
                num: 11,
                date: "M: 2/15",
                topic: "Advanced Javascript: Ajax I",
                project: "Ajax Component",
                notes: "David 18"
            },
            {
                num: 12,
                date: "W: 2/17",
                topic: "Advanced Javascript: Ajax II",
                project: "Ajax Component",
                notes: "David 18"
            },
            {
                date: "F: 2/19",
                topic: "Lab 5: Node.js",
                project: "Evaluation tool upon Ajax",
                notes: "Quiz5",
                type: "Lab"
            }
        ]
    },
    {
        tag: "jQuery",
        classes: [
            {
                num: 13,
                date: "M: 2/22",
                topic: "Advanced Javascript: jQuery I",
                project: "Use jQuery",
                notes: "David 19"
            },
            {
                num: 14,
                date: "W: 2/24",
                topic: "Advanced Javascript: jQuery II",
                project: "Use jQuery",
                notes: "David 19"
            },
            {
                date: "F: 2/26",
                topic: "Lab 6: Node.js",
                project: "Construct schedule table",
                notes: "Quiz6",
                type: "Lab"
            }
        ]
    },
    {
        tag: "HTML Media & Graphics",
        classes: [
            {
                num: 15,
                date: "M: 2/29",
                topic: "Scripting images",
                notes: "David 21"
            },
            {
                num: 16,
                date: "W: 3/2",
                topic: "Graphics in canvas",
                notes: "David 21"
            },
            {
                date: "F: 3/4",
                topic: "Lab 7: Node.js",
                project: "UML class editor",
                notes: "Quiz7",
                type: "Lab"
            }
        ]
    },
    {
        tag: "HTML 5 API",
        classes: [
            {
                num: 17,
                date: "M: 3/14",
                topic: "Web Workers",
                notes: "David 21"
            },
            {
                num: 18,
                date: "W: 3/16",
                topic: "Web Sockets",
                notes: "David 21"
            },
            {
                date: "F: 3/18",
                topic: "Lab 8: Node.js",
                project: "Group Chat",
                notes: "Quiz8",
                type: "Lab"
            }
        ]
    },
    {
        tag: "JSP",
        classes: [
            {
                num: 19,
                date: "M: 3/21",
                topic: "Fundamental JSP",
                project: "Use GlassFish inside Netbeans",
            },
            {
                num: 20,
                date: "W: 3/23",
                topic: "JSP & JavaBeans",
                notes: "Martin ch1"
            },
            {
                date: "F: 3/25",
                topic: "Lab 9: JSP",
                project: "Roster JSP with JavaBeans",
                notes: "Quiz9",
                type: "Lab"
            }
        ]
    },
    {
        tag: "REST",
        classes: [
            {
                num: 21,
                date: "M: 3/28",
                topic: "JSP & MVC",
                notes: "Martin ch1"
            },
            {
                num: 22,
                date: "W: 3/30",
                topic: "RESTful Web Services: HttpServlet",
                project: "Intro to REST principles",
                notes: "Martin ch2"
            },
            {
                date: "F: 4/1",
                topic: "Lab 10: RESTful Web Services (MVC)",
                project: "RESTful service with MVC",
                notes: "Quiz10",
                type: "Lab"
            }
        ]
    },
    {
        tag: "REST",
        classes: [
            {
                num: 23,
                date: "M: 4/4",
                topic: "RESTful Web Services: jTables & DB",
            },
            {
                num: 24,
                date: "W: 4/6",
                topic: "RESTful Web Services: HttpServlet",
                notes: "Martin ch2"
            },
            {
                date: "F: 4/8",
                topic: "Lab 11: RESTful Web Services (jTable)",
                project: "RESTful service with jTableUI",
                type: "Lab"
            }
        ]
    },
    {
        tag: "REST",
        classes: [
            {
                num: 25,
                date: "M: 4/11",
                topic: "Consuming RESTful Services on the Web",
                project: "Javascript client to Pub. REST",
                notes: "Martin ch3"
            },
            {
                num: 26,
                date: "W: 4/13",
                topic: "Lab12: Real world RESTful Web Services",
                notes: "Martin ch3"
            },
            {
                date: "F: 4/15",
                topic: "Work on project",
                project: "Teamwork Calendar",
                type: "Lab"
            }
        ]
    },
    {
        tag: "Project",
        classes: [
            {
                num: 27,
                date: "M: 4/18",
                topic: "Work on project",
                project: "Teamwork Calendar"
            },
            {
                num: 28,
                date: "M: 4/20",
                topic: "Work on project",
            },
            {
                date: "M: 4/22",
                topic: "Work on project",
                type: "Lab"
            }
        ]
    },
    {
        tag: "Project",
        classes: [
            {
                date: "M: 4/25",
                topic: "Final Project Presentation",
                type: "Presentation"
            },
            {
                date: "M: 4/27",
                topic: "Final Project Presentation",
                type: "Presentation"
            },
            {
                date: "M: 4/29",
                topic: "Final Project Presentation",
                type: "Presentation"
            }
        ]
    },
];

function gettool(req, res) {
    //determine what the client is requesting:
    var filename = gettool.root + req.path;
    switch(req.path) {
        case "/Schedule/content" : //request for the content of the schedule:
			console.log("about to send content as some sick jsonp");
            res.jsonp(JSON.stringify(schedule));
			break;
        default : //generic request handling:
            // Retrieve the file path.
			var filename = gettool.root + req.path;

			// Send the file as a response.
			res.sendfile(filename, function(err) {
				// Log any error.
				if (err) {
					console.log(err);
					res.status(err.status).end();
				}
				else
					console.log("Sent " + filename);
			});
			break;
    }
}

exports.gettool = gettool;