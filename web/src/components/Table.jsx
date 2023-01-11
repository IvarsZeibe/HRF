const Table = ({theadData, tbodyData = null, hiddenIndices = [], customTDStyle = {}}) => {
    return (
    <table style={{background: "white"}}>
        <thead>
            <tr>
                {theadData.filter((_, i) => !hiddenIndices.includes(i)).map(heading => {
                    return <th key={heading}>{heading}</th>
                })}
            </tr>
        </thead>
        <tbody>
            {tbodyData.map((tr, index1) => {
                return <tr key={index1}>
                    {tr.filter((_, i) => !hiddenIndices.includes(i)).map((td, index2) => {
                        return <td style={customTDStyle} key={index2}>{td}</td>;
                    })}
                </tr>;
            })}
        </tbody>
    </table>
    );
}

export default Table;