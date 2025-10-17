// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AdminLayout from "@/views/admin/AdminLayout.vue";
import Dashboard from "@/views/admin/Dashboard.vue";
import DataPopulation from "@/views/admin/DataPopulation.vue";
import DataResidence from "@/views/admin/DataResidence.vue";
import DirectoryOfficials from "@/views/admin/DirectoryOfficials.vue";
import PermitsClearance from "@/views/admin/PermitsClearance.vue";
import PermitsSanitary from "@/views/admin/PermitsSanitary.vue";
import PermitsBusiness from "@/views/admin/PermitsBusiness.vue";
import RequestsDocuments from "@/views/admin/RequestsDocuments.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/about", name: "about", component: () => import("../views/AboutView.vue") },
    { path: "/login", name: "login", component: () => import("../views/auth/login.vue") },
    { path: "/register", name: "register", component: () => import("../views/auth/register.vue") },
    { path: "/services", name: "services", component: () => import("../views/Services.vue") },
    { path: "/myrequest", name: "myrequest", component: () => import("../views/MyRequest.vue"), meta: { requiresAuth: true } },
    { path: "/clearance", name: "Clearance", component: () => import("@/views/Clearance.vue"), meta: { requiresAuth: true } },
    { path: "/business-permit", name: "BusinessPermit", component: () => import("@/views/BusinessPermit.vue"), meta: { requiresAuth: true } },
    { path: "/sanitary", name: "Sanitary", component: () => import("@/views/Sanitary.vue"), meta: { requiresAuth: true } },
    { path: "/profile", name: "Profile", component: () => import("@/components/Profile.vue"), meta: { requiresAuth: true } },
{
  path: "/reset-password/:token",
  name: "reset-password",
  component: () => import("../views/ResetPassword.vue"),
},


    {
      path: "/admin",
      component: AdminLayout,
      meta: { requiresAdmin: true }, // mark as admin route
      children: [
        { path: "", name: "Dashboard", component: Dashboard },
        { path: "data/population", component: DataPopulation },
        { path: "data/residence", component: DataResidence },
        { path: "directory/officials", component: DirectoryOfficials },
        { path: "permits/clearance", component: PermitsClearance },
        { path: "permits/sanitary", component: PermitsSanitary },
        { path: "permits/business", component: PermitsBusiness },
        { path: "requests/documents", component: RequestsDocuments },
        { path: "permits/clearance/print", name: "BarangayClearancePrint", component: () => import("@/views/admin/permits/BarangayClearancePrint.vue") },
        { path: "permits/sanitary/print", name: "BarangaySanitaryPrint", component: () => import("@/views/admin/permits/BarangaySanitaryPrint.vue") },
        { path: "permits/business/print", name: "BarangayBusinessPrint", component: () => import("@/views/admin/permits/BarangayBusinessPrint.vue") },
      ],
    },

    // Catch-all route for 404
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

// Route Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const userType = localStorage.getItem("userType"); // "Admin" or "User"

  // Prevent logged-in users from accessing login/register
  if (isLoggedIn && (to.name === "login" || to.name === "register")) {
    return next({ name: "home" });
  }

  // Protect routes that require authentication
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: "login" });
  }

  // Protect admin routes
  if (to.meta.requiresAdmin) {
    if (!isLoggedIn) return next({ name: "login" });
    if (userType?.toLowerCase() !== "admin") return next({ name: "home" }); // redirect non-admins
  }

  next();
});

export default router;
