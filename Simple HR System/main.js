// In-memory database simulation (replace with actual database connection in production)
let employeeDB = {
    employees: [],
    
    init: function() {
        // Attempt to load from localStorage
        const savedData = localStorage.getItem('employeeDB');
        if (savedData) {
            this.employees = JSON.parse(savedData);
            this.updateUI();
        }
        
        // Set up event listeners
        document.getElementById('addEmployeeBtn').addEventListener('click', () => this.addEmployee());
        document.getElementById('searchInput').addEventListener('input', (e) => this.searchEmployee(e.target.value));
        document.getElementById('createTableBtn').addEventListener('click', () => this.createTable());
        document.getElementById('seedDataBtn').addEventListener('click', () => this.seedData());
        document.getElementById('clearDataBtn').addEventListener('click', () => this.clearData());
        
        this.updateUI();
    },
    
    createTable: function() {
        this.employees = [];
        this.saveToLocalStorage();
        alert("تم إنشاء جدول الموظفين بنجاح (في هذه النسخة يتم حفظ البيانات فقط في المتصفح)");
        this.updateUI();
    },
    
    seedData: function() {
        const sampleData = [
            { empId: 83975, name: "abeer", dept: "eng", salary: 50000 },
            { empId: 49523, name: "brouq", dept: "eng", salary: 60000 },
            { empId: 39403, name: "muath", dept: "eng", salary: 30000 },
            { empId: 10283, name: "adel", dept: "eng", salary: 40000 }
        ];
        
        this.employees = sampleData;
        this.saveToLocalStorage();
        alert("تم إضافة البيانات النموذجية بنجاح");
        this.updateUI();
    },
    
    clearData: function() {
        if (confirm("هل أنت متأكد من حذف جميع بيانات الموظفين؟")) {
            this.employees = [];
            this.saveToLocalStorage();
            this.updateUI();
            alert("تم مسح جميع البيانات");
        }
    },
    
    addEmployee: function() {
        const empId = document.getElementById('empId').value;
        const name = document.getElementById('name').value;
        const dept = document.getElementById('dept').value;
        const salary = document.getElementById('salary').value;
        
        if (!empId || !name || !salary) {
            alert("الرجاء ملء جميع الحقول المطلوبة");
            return;
        }
        
        if (this.employees.some(e => e.empId == empId)) {
            alert("هذا الرقم الوظيفي مسجل مسبقاً");
            return;
        }
        
        const newEmployee = {
            empId: parseInt(empId),
            name: name,
            dept: dept,
            salary: parseInt(salary)
        };
        
        this.employees.push(newEmployee);
        this.saveToLocalStorage();
        
        // Clear form
        document.getElementById('empId').value = '';
        document.getElementById('name').value = '';
        document.getElementById('dept').value = 'eng';
        document.getElementById('salary').value = '';
        
        alert("تم إضافة الموظف بنجاح");
        this.updateUI();
    },
    
    searchEmployee: function(query) {
        const resultsDiv = document.getElementById('searchResults');
        
        if (!query) {
            resultsDiv.innerHTML = '';
            return;
        }
        
        query = query.toLowerCase();
        const results = this.employees.filter(emp => 
            emp.empId.toString().includes(query) || 
            emp.name.toLowerCase().includes(query)
        );
        
        if (results.length === 0) {
            resultsDiv.innerHTML = '<div class="alert alert-warning">لا توجد نتائج</div>';
            return;
        }
        
        let html = '<div class="list-group">';
        results.forEach(emp => {
            html += `
                <a href="#" class="list-group-item list-group-item-action" 
                   onclick="employeeDB.showEmployeeDetails(${emp.empId})">
                    ${emp.empId} - ${emp.name} (${this.getDepartmentName(emp.dept)})
                </a>
            `;
        });
        html += '</div>';
        
        resultsDiv.innerHTML = html;
    },
    
    showEmployeeDetails: function(empId) {
        const emp = this.employees.find(e => e.empId == empId);
        if (!emp) return;
        
        const modal = document.getElementById('employeeDetails');
        modal.innerHTML = `
            <p><strong>رقم الموظف:</strong> ${emp.empId}</p>
            <p><strong>الاسم:</strong> ${emp.name}</p>
            <p><strong>القسم:</strong> ${this.getDepartmentName(emp.dept)}</p>
            <p><strong>الراتب:</strong> ${emp.salary.toLocaleString()} ريال</p>
        `;
        
        // Show the modal
        const modalInstance = new bootstrap.Modal(document.getElementById('employeeModal'));
        modalInstance.show();
    },
    
    getDepartmentName: function(deptCode) {
        const departments = {
            'eng': 'الهندسة',
            'hr': 'الموارد البشرية',
            'finance': 'المالية',
            'it': 'تقنية المعلومات'
        };
        return departments[deptCode] || deptCode;
    },
    
    updateUI: function() {
        const tableBody = document.getElementById('employeesTableBody');
        tableBody.innerHTML = '';
        
        this.employees.forEach(emp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${emp.empId}</td>
                <td>${emp.name}</td>
                <td>${this.getDepartmentName(emp.dept)}</td>
                <td>${emp.salary.toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-info" 
                            onclick="employeeDB.showEmployeeDetails(${emp.empId})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" 
                            onclick="employeeDB.deleteEmployee(${emp.empId})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    },
    
    deleteEmployee: function(empId) {
        if (confirm("هل أنت متأكد من حذف هذا الموظف؟")) {
            this.employees = this.employees.filter(emp => emp.empId != empId);
            this.saveToLocalStorage();
            this.updateUI();
            alert("تم حذف الموظف بنجاح");
        }
    },
    
    saveToLocalStorage: function() {
        localStorage.setItem('employeeDB', JSON.stringify(this.employees));
    }
};

// Initialize the application
window.onload = function() {
    employeeDB.init();
};