const Table = ({theadData, tbodyData}) => {
    return (
    <table style={{background: "white"}}>
        <thead>
            <tr>
                {theadData.map(heading => {
                    return <th key={heading}>{heading}</th>
                })}
            </tr>
        </thead>
        <tbody>
            {tbodyData.map((tr, index1) => {
                return <tr key={index1}>
                    {tr.map((td, index2) => {
                        return <td key={index2}>{td}</td>;
                    })}
                </tr>;
            })}
        </tbody>
    </table>
    );
}

export default Table;