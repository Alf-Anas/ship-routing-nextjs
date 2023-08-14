export function propertiesTableDiv(props: any) {
    const listRow: string[] = [];

    for (const key in props) {
        if (key === "areas" || key === "vessel") continue;
        if (props.hasOwnProperty(key)) {
            const row = `<tr style='${
                listRow.length % 2 === 0 ? "background-color: #dddddd" : ""
            }'>
            <td>${key}</td>
            <td>${props[key]}</td>
          </tr>`;
            listRow.push(row);
        }
    }

    return `<table style='border: 1px solid #dddddd'>${listRow.join(
        ""
    )}</table>`;
}

export function msToTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours} Hour, ${minutes.toString().padStart(2, "0")} Minute, ${seconds
        .toString()
        .padStart(2, "0")} Second`;
}
