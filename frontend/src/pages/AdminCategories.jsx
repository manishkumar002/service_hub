import { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getErrorMessage,
} from "../api/services";

const emptyForm = { name: "", slug: "", description: "", icon: "" };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShow(true);
  };

  const openEdit = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      icon: cat.icon || "",
    });
    setShow(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCategory(editingId, form);
        toast.success("Category updated");
      } else {
        await createCategory(form);
        toast.success("Category created");
      }
      setShow(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete category?")) return;
    try {
      await deleteCategory(id);
      toast.success("Deleted");
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between mb-4">
        <h1>Manage Categories</h1>
        <Button className="btn-sh-primary" onClick={openCreate}>+ Add Category</Button>
      </div>
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <div className="sh-card p-3 table-responsive">
          <Table hover>
            <thead>
              <tr><th>Name</th><th>Slug</th><th>Icon</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.slug}</td>
                  <td>{c.icon}</td>
                  <td>
                    <Button size="sm" className="btn-sh-outline me-1" onClick={() => openEdit(c)}>Edit</Button>
                    <Button size="sm" className="btn-sh-danger-outline" onClick={() => handleDelete(c._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit" : "Add"} Category</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {["name", "slug", "description", "icon"].map((f) => (
              <Form.Group className="mb-3" key={f}>
                <Form.Label className="text-capitalize">{f}</Form.Label>
                <Form.Control
                  value={form[f]}
                  onChange={(e) => setForm((p) => ({ ...p, [f]: e.target.value }))}
                  required={f === "name" || f === "slug"}
                />
              </Form.Group>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button type="submit" className="btn-sh-primary">Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminCategories;
