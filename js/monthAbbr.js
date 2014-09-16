//get the turkish month abbreviation
function getMonthAbbreviation(month) {
    switch (month) {
        case "Jan":
            return "Oca";
            break;
        case "Feb":
            return "&#350;ub";
            break;
        case "Mar":
            return "Mart";
            break;
        case "Apr":
            return "Nis";
            break;
        case "May":
            return "May";
            break;
        case "Jun":
            return "Haz";
            break;
        case "Jul":
            return "Tem";
            break;
        case "Aug":
            return "A&#287;u";
            break;
        case "Sep":
        case "Sept":
            return "Eyl";
            break;
        case "Oct":
            return "Eki";
            break;
        case "Nov":
            return "Kas";
            break;
        case "Dec":
            return "Ara";
            break;
    }
}