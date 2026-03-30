# Hostel Complaint System – Selenium Automation (Eclipse)

**All test automation is in one file:** `src/test/java/experiment4/ComplaintSystemAllTests.java`

## What’s in the file

| Item | Description |
|------|-------------|
| **Module 1** | `testRegistrationPage()` – Registration page (Student sign up → dashboard) |
| **Module 2** | `testLoginPage()` – Login page (Login → dashboard) |
| **Module 3** | `testHomePage()` – Home page (Welcome, Quick Actions, My Complaints visible) |
| **Module 4** | `testCoreFunctionalityAddComplaint()` – Add complaint and verify in list |
| **Full E2E** | `testFullE2EStudentAndWarden()` – Student add complaint, Warden view and mark done |
| **main()** | Runs Module 1 → 2 → 3 → 4 in one browser (for demo) |

---

## Prerequisites
- **Backend** running: `cd backend && node sever.js` (MongoDB must be running)
- **Frontend** running: `cd frontend/complaint-system && npm run dev` (http://localhost:5173)
- **Chrome** installed
- **Java 17+** and **Maven** (Eclipse with Maven plugin)

---

## Eclipse – how to run

1. **Import as Maven project**
   - File → Import → Maven → Existing Maven Projects
   - Select the `e2e-selenium` folder → Finish

2. **Run all tests (JUnit)**  
   - Open `src/test/java/experiment4/ComplaintSystemAllTests.java`  
   - Right-click the class → **Run As** → **JUnit Test**  
   - Runs all 5 tests (each opens and closes its own browser).  
   - To run only one module: right-click that method (e.g. `testRegistrationPage`) → **Run As** → **JUnit Test**

3. **Run full flow in one browser (Java Application)**  
   - Open the same file `ComplaintSystemAllTests.java`  
   - Right-click the class → **Run As** → **Java Application**  
   - Runs: Registration → Logout → Login → Home checks → Add Complaint, then closes browser.

---

## If you use a different package name
- Create your package (e.g. `experiment4`) in Eclipse.
- Copy the contents of `ComplaintSystemAllTests.java` into a new class in that package.
- Ensure `pom.xml` has `selenium-java` and `junit-jupiter` dependencies.
