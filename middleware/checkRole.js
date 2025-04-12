// middleware/checkRole.js
module.exports = function (...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    next();
  };
};
