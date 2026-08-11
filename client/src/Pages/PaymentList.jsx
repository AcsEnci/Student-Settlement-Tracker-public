import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../Components/Loading';
import PaymentTable from '../Components/StudentTable/PaymentTable';

const updateStudent = (student) => {
    return fetch(`/api/students/${student._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    }).then((res) => res.json());
  };
  
  const fetchStudent = (id) => {
    return fetch(`/api/students/${id}`).then((res) => res.json());
  };
  

function PaymentList() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
  const [canDelete, setCanDelete] = useState(false);
  const [studentLoading, setStudentLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    setStudentLoading(true);
    fetchStudent(id)
      .then((student) => {
        setStudent(student);
        setStudentLoading(false);
        setCanDelete(!student.balance && student.payments.length);
        setPayments(student.payments);
      });
  }, [id]);

  const deletePayments = () => {
    setPayments ([]);
    updateStudent({...student,
        payments:[],
    })
    navigate("/");
  }

  if (studentLoading) {
    return <Loading />;
  }

  if (isDeleting) {
    return <div>
        <h1>Biztos, hogy törölni szeretnéd {student.name} könyvelési előzményeit?</h1>
        <button onClick={deletePayments}>IGEN</button>
        <button onClick={() => {setIsDeleting(false)}}>NEM</button>
    </div>
  }

  return (
    <div>
        <h1>{student.name} könyvelése:</h1>
        <h2>rendszerben létrehozva: {new Date(student.created).toLocaleDateString("hu-HU")}</h2>
      {canDelete? (
          <button onClick={() => {setIsDeleting(true)}}>Könyvelés törlése</button>
        ):(
          <h2>Nem törölhető</h2>
        )}
        <button onClick={() => {navigate("/")}}>Vissza</button>
        <PaymentTable payments={payments} />
    </div>
  )
}

export default PaymentList;
