import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { buySubscription, getMySubscription, getErrorMessage } from "../api/services";
import { formatDate } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";

const plans = [
  { id: "monthly", name: "Monthly", price: 499, period: "1 month" },
  { id: "yearly", name: "Yearly", price: 4999, period: "12 months", popular: true },
];

const Subscription = () => {
  const { refreshProfile } = useAuth();
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(null);

  const load = async () => {
    try {
      const { data } = await getMySubscription();
      setCurrent(data.subscription);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleBuy = async (plan) => {
    setBuying(plan);
    try {
      await buySubscription({ plan, paymentId: "pay_sub_" + Date.now() });
      toast.success("Subscription activated!");
      await refreshProfile();
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBuying(null);
    }
  };

  return (
    <Container>
      <h1 className="mb-2">Provider Subscription</h1>
      <p className="text-muted mb-4">
        Free providers can apply to 5 jobs. Upgrade for unlimited applications and premium badge.
      </p>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : current ? (
        <Card className="sh-card border-0 p-4 mb-4">
          <Badge className="mb-2" style={{ background: "var(--sh-black)" }}>Active Plan</Badge>
          <h4 className="text-capitalize">{current.plan}</h4>
          <p className="text-muted mb-0">Valid until {formatDate(current.endDate)}</p>
        </Card>
      ) : null}

      <Row className="g-4 justify-content-center">
        {plans.map((p) => (
          <Col md={5} key={p.id}>
            <Card className={`sh-card h-100 p-4 text-center ${p.popular ? "border border-dark border-2" : ""}`}>
              {p.popular && <Badge className="mb-2" style={{ background: "var(--sh-black)" }}>Best Value</Badge>}
              <h3>{p.name}</h3>
              <p className="display-6 fw-bold">₹{p.price}</p>
              <p className="text-muted">{p.period}</p>
              <ul className="list-unstyled small text-start mb-4">
                <li>✓ Unlimited job applications</li>
                <li>✓ Premium provider badge</li>
                <li>✓ Priority in search</li>
              </ul>
              <Button
                className="w-100 btn-sh-primary"
                onClick={() => handleBuy(p.id)}
                disabled={buying === p.id}
              >
                {buying === p.id ? <Spinner size="sm" /> : `Subscribe ${p.name}`}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Subscription;
