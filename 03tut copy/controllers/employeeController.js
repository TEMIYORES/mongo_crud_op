const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createNewEmployee = (req, res) => {
  const { firstname, lastname } = req.body;
  const newEmployee = {
    id: data.employees.length + 1,
    firstname: firstname,
    lastname: lastname,
  };
  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
  const { id, firstname, lastname } = req.body;
  const employee = data.employees.find((emp) => emp.id === parseInt(id));
  if (!employee) {
    return res.status(400).json({ error: `Employee with ${id} Id Not Found` });
  }
  if (firstname) employee.firstname = firstname;
  if (lastname) employee.lastname = lastname;
  const filteredEmps = data.employees.filter((emp) => emp.id !== parseInt(id));
  const unsortedEmps = [...filteredEmps, employee];
  data.setEmployees(
    unsortedEmps.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  res.status(200).json(data.employees);
};

const deleteEmployee = (req, res) => {
  const { id } = req.body;
  const employee = data.employees.find((emp) => emp.id === parseInt(id));
  if (!employee) {
    return res.status(400).json({ error: `Employee with ${id} Id Not Found` });
  }

  const filteredEmps = data.employees.filter((emp) => emp.id !== parseInt(id));
  data.setEmployees(filteredEmps);
  res.status(200).json(data.employees);
};
const getEmployee = (req, res) => {
  const { id } = req.params;
  const employee = data.employees.find((emp) => emp.id === parseInt(id));
  if (!employee) {
    return res.status(400).json({ error: `Employee with ${id} Id Not Found` });
  }
  res.status(200).json(employee);
};
module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
