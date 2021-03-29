import Rupiah from "./Rupiah"

const CardHistoryOrder = ({ item, index, toTransaction }) => {
    return (
        <div className="card mb-1 icon-click card-rest" onClick={() => toTransaction(item.id)} key={index}>
            <div className="card-body py-2">
                <div className="box-2-column-text">
                    <div className="">
                        <div className="playfair mb-2 text-dark"><b>{item.user.fullname}</b></div>
                        <div className="text-dark">{formatDate(item.date)}</div>
                        <div className="text-rest mt-2"><b>Total : Rp <Rupiah nominal={item.price} /></b></div>
                    </div>
                    <div className="ml-3 text-right d-block">
                        <img src="../assets/icon.png" />
                        <div className="mt-4">
                            {formatStatus(item.status)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function formatStatus(status) {
    if (status == 'waiting') {
        return <span className="bg-waiting px-4 py-1 rounded">Waiting</span>
    } else if (status == 'success') {
        return <span className="bg-finished px-4 py-1 rounded">Success</span>
    } else if (status == 'on the way') {
        return <span className="bg-otw px-4 py-1 rounded">On The Way</span>
    } else if (status == 'cancel') {
        return <span className="bg-cancel px-4 py-1 rounded">Cancel</span>
    }
}

function formatDate(timestamp) {
    var x = new Date(timestamp);
    var dd = x.getDate();
    var mm = x.getMonth() + 1;
    var yy = x.getFullYear();
    var hh = x.getHours();
    var mm = x.getMinutes();
    var ss = x.getSeconds();
    return dd + "-" + mm + "-" + yy + " " + hh + ":" + mm;
}

export default CardHistoryOrder;
