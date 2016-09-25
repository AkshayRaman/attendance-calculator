//Most of these scripts aren't needed since the data on the HTML is static.
$(document).ready(function() {
    //Adding day order column
    $("table#timetable td:nth-child(1)").each(function(index, element) {
        element.outerHTML = "<td class='heading'><b>Day " + (index + 1) + "</b></td>" + element.outerHTML;
    });

    //Adding Header row
    var start = "<td><b>Day Order\/Hour</b></td>";
    var count = $("table#timetable tr td").length / $("table#timetable tr").length;

    var output = '';
    for (var i = 1; i < count; i++)
        output += "<td><b>" + i + "</b></td>";

    $("table#timetable tr:first-child")[0].outerHTML = "<tr class='heading'>" + start + output + "</tr>" + $("table#timetable tr:first-child")[0].outerHTML;

    formatAttendanceTable();
});

function formatAttendanceTable() {
	//Not used here, used only with the back-end.
    $("table#attendanceTable tr td[class=before]:nth-child(5)").each(
        function(index, element) {
            $(this).css("background-color", getColour(element.innerHTML));
        });

    $("table#attendanceTable tr td[class=after]:nth-child(11)").each(
        function(index, element) {
            $(this).css("background-color", getColour(element.innerHTML));
        });
}

function getColour(marks) {
    marks = parseFloat(marks);
    if (marks < 75)
        return "#EB6767";
    if (marks < 80)
        return "#EBAD67";
    if (marks < 85)
        return "#EBEB67";
    if (marks < 90)
        return "#67E2EB";
    if (marks < 95)
        return "#6767EB";
    if (marks <= 100)
        return "#67EB67";
}

function lockTable() {
    $("table#timetable").find('option:selected').each(
        function(index, element) {
            $(this).parent().parent().text(element.innerHTML);
        }
    )
}

function isInt(a) {
    var intRegex = /^\d+$/;
    return intRegex.test(a);
}

function toggleBtnClass(btn) {
    if (btn.hasClass("btn-info")) {
        btn.removeClass("btn-info").addClass("btn-danger");
        $row = (btn.parent());
        if ($row.find("td[class=btn-danger]").length == 7)
            $row.find("button").html("Attend");
    } else if (btn.hasClass("btn-danger")) {
        btn.removeClass("btn-danger").addClass("btn-info");
        $row = (btn.parent());
        if ($row.find("td[class=btn-info]").length == 7)
            $row.find("button").html("Bunk");
    }
}

function toggleRow(btn) {
    if (btn.html() == "Bunk") {
        $row = (btn.parent().parent());
        $row.find("td[class=btn-info]").each(
            function(index, element) {
                $(this).removeClass("btn-info").addClass("btn-danger");
            });
        btn.html("Attend");
    } else if (btn.html() == "Attend") {
        $row = (btn.parent().parent());
        $row.find("td[class=btn-danger]").each(
            function(index, element) {
                $(this).removeClass("btn-danger").addClass("btn-info");
            });
        btn.html("Bunk");
    }
}

function getDayOrderTimeTable(dayOrder) {
    if (!isInt(dayOrder) || dayOrder < 1 || dayOrder > 5) {
        $("div#left").append("Garbage in, Garbage out.\nEnter a valid day order if you want to use this service, otherwise go away.")
        return;
    }
    var output = '';
    for (var i = 0; i < 7; i++)
        output += '<td class="btn-info" onclick="toggleBtnClass($(this))">' + $('table#timetable tr:not(.heading) td:gt(' + i + ')')[8 * (dayOrder - 1)].innerHTML + '</td>';
    return output;
}

function futureTimeTableGenerator() {
    //Not used, since the attendance data is old.
	var dayOrder = prompt("If today is a working day, enter today's day order\nOtherwise, enter the day order of the next working day:");

    if (!isInt(dayOrder) || dayOrder < 1 || dayOrder > 5) {
        $("div#left").append("Garbage in, Garbage out.\nEnter a valid day order.")
        return;
    }

    $("div#left").append("<h4><center>Predicted Time Table</center></h4>");

    dayOrder -= 1;
    var todayDate = new Date();
    todayDate = new Date(todayDate.getFullYear() + '-' + pad(todayDate.getMonth() + 1) + '-' + pad(todayDate.getDate()));
    var endDate = new Date("2015-04-30");
    var days = "Sun;Mon;Tue;Wed;Thu;Fri;Sat".split(";");

    var holidays = computeHolidayList();
    $("div#left").append('<div id="generatedTimeTableDiv" style="max-height:500px;overflow-y:auto">');
    $("div#generatedTimeTableDiv").append('<table class="table table-condensed table-bordered" id="generatedTimeTable">');
    $("table#generatedTimeTable").append('<tr class="btn-inverse"><td onclick="getAllClassData($(this))">Date</td><td>Day Order</td><td colspan="7" style="text-align:center">Time Table</td><td>Bunk/Attend</td></tr>');

    outer:
        for (var i = todayDate.getTime(); i <= endDate.getTime(); i += 24*60*60*1000) {
            for (var j = 0; j < holidays.length; j++) {
                if (i == holidays[j].getTime()) {
                    printHoliday(i);
                    continue outer;
                }
            }

            var temp = new Date(i);
            var day = days[temp.getDay()];
            var fullDate = getFullDate(temp);
            if (day == days[0] || day == days[6]) {
                printHoliday(i);
                continue;
            }

            dayOrder = (dayOrder % 5) + 1;
            $("table#generatedTimeTable").append('<tr><td class="btn-primary" onclick="getAllClassData($(this))">' + fullDate + '</td><td align="center">' + dayOrder + '</td>' + getDayOrderTimeTable(dayOrder) + '<td ><button class="btn btn-warning" onclick="toggleRow($(this))">Bunk</button></td></tr>');
        }

    var workingDays = $("table#generatedTimeTable tr td.btn-primary").length;
    var holidays = $("table#generatedTimeTable tr.btn-success").length;
    var total = workingDays + holidays;
    $("div#right").append('<div id="remaining">');
    $("div#remaining").append("<h6>Total number of days remaining: " + total + "</h6>");
    $("div#remaining").append("<h6>Number of working days remaining: " + workingDays + "</h6>");
    $("div#remaining").append("<h6>Number of holidays remaining: " + holidays + "</h6>");
}

function resetTables() {
	//Not used here, used only with the back-end.
    for (var i = 2; i <= 6; i++) {
        var target = $('td.after:nth-child(' + (i + 6) + ')');
        $('td.before:nth-child(' + i + ')').each(function(rowIndex) {
            target.slice(rowIndex, rowIndex + 1).text($(this).text());
        });
    }
}

function computePercentage() {
    var total = $('td.after:nth-child(8)');
    var present = $('td.after:nth-child(9)');
    var percentage = $('td.after:nth-child(11)');

    for (var i = 0; i < total.length; i++)
        percentage[i].innerHTML = (parseInt(present[i].innerHTML) * 100 / (parseInt(total[i].innerHTML))).toFixed(2);;
}

function resetGeneratedTable() {
    //Not used here, used only with the back-end.
	$("div#left h4").remove();
    $("div#remaining").remove();
    $("div#left button.btn-danger").remove();
    $("div#generatedTimeTableDiv").remove();
    futureTimeTableGenerator();
}

function resetAll() {
    document.location.reload();
	/*
	Not needed since the attendance data is stale. Just refresh the document
	resetGeneratedTable();
    resetTables();
    formatAttendanceTable();
	*/
}

function getAllClassData(elem) {
    resetTables();
    var index = getIndexOfWorkingDay(elem);
    var bunk = getBunkedClasses(elem, index);
    var attend = getAttendedClasses(elem, index);

    console.log(bunk);
    console.log(attend);

    var BUNK_INDEX = 10;
    var ATTEND_INDEX = 9;
    var TOTAL_INDEX = 8;
    var PERCENTAGE_INDEX = 11;

    for (var i = 0; i < bunk.length; i++) {
        var oldBunk = parseInt($('td#' + bunk[i] + '.after:nth-child(' + BUNK_INDEX + ')').html());
        $('td#' + bunk[i] + '.after:nth-child(' + BUNK_INDEX + ')').html(oldBunk + 1);

        var oldTotal = parseInt($('td#' + bunk[i] + '.after:nth-child(' + TOTAL_INDEX + ')').html());
        $('td#' + bunk[i] + '.after:nth-child(' + TOTAL_INDEX + ')').html(oldTotal + 1);
    }

    for (var i = 0; i < attend.length; i++) {
        var oldAttend = parseInt($('td#' + attend[i] + '.after:nth-child(' + ATTEND_INDEX + ')').html());
        $('td#' + attend[i] + '.after:nth-child(' + ATTEND_INDEX + ')').html(oldAttend + 1);

        var oldTotal = parseInt($('td#' + attend[i] + '.after:nth-child(' + TOTAL_INDEX + ')').html());
        $('td#' + attend[i] + '.after:nth-child(' + TOTAL_INDEX + ')').html(oldTotal + 1);
    }

    computePercentage();
    formatAttendanceTable();
}

function getBunkedClasses(elem, index) {
    var bunked = [];
    elem.parent().parent().find('td.btn-primary:lt(' + (index + 1) + ')').siblings('td.btn-danger').each(function(i, element) {
        bunked.push($(this).html());
    });
    //console.log(bunked);
    return bunked;

}

function getAttendedClasses(elem, index) {
    var attended = [];
    elem.parent().parent().find('td.btn-primary:lt(' + (index + 1) + ')').siblings('td.btn-info').each(function(i, element) {
        attended.push($(this).html());
    });
    //console.log(attended);
    return attended;
}

function getBunkedClassesCount(elem, index) {
    return elem.parent().parent().find('td.btn-primary:lt(' + (index + 1) + ')').siblings('td.btn-danger').length;
}

function getAttendedClassesCount(elem, index) {
    return elem.parent().parent().find('td.btn-primary:lt(' + (index + 1) + ')').siblings('td.btn-info').length;
}

function getIndexOfWorkingDay(elem) {
    index = elem.parent().parent().find('.btn-primary').index(elem);
    elem.parent().parent().find('.btn-primary').parent().css("background-color", "");
    elem.parent().parent().find('.btn-primary:lt(' + (index + 1) + ')').parent().css("background-color", "#EFF1A7");
    return index;
}

function printHoliday(i) {
    $("table#generatedTimeTable").append('<tr class="btn-success"><td>' + getFullDate(new Date(i)) + '</td><td colspan="9" style="text-align:center">HOLIDAY!</td><tr>');
}

function getFullDate(temp) {
    var days = "Sun;Mon;Tue;Wed;Thu;Fri;Sat".split(";");
    var day = days[temp.getDay()];
    var date = temp.getDate();
    var month = temp.getMonth();
    var year = temp.getYear() - 100;
    var fullDate = day + ", " + year + "-" + pad(month + 1) + "-" + pad(date);
    return fullDate;
}

function pad(a) {
    return a < 10 ? '0' + a : a;
}

function computeHolidayList() {
    var holString = "2015-01-26;2015-04-02;2015-04-03;2015-04-14;2015-05-01;"
    var hols = holString.split(";");
    var holidays = new Array();
    for (var i = 0; i < hols.length; i++)
        holidays[i] = new Date(hols[i]);
    return holidays;
}

/*function generateCalendar()
{
	var defaultDate = new Date(2013,9-1,2);
	var defaultDayOrder = 1;
	var holidays = computeHolidayList();
	
	var startDate = Date.now();
	var endDate = new Date(2013,10-1,23);
}*/