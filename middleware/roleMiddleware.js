function requireRole(role) {
  return (req, res, next) => {
    console.log("Inside requireRole, user:", req.user);

    if (!req.user || !req.user.isStaff) {
      return res.status(403).json({ message: 'Forbidden - Not staff' });
    }

    if (role === 'staff' && req.user.isStaff !== true) {
      return res.status(403).json({ message: 'Forbidden - Role mismatch' });
    }

    next();
  };
}

module.exports = requireRole;
