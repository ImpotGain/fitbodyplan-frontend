const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { authLimit } = require('../middleware/rateLimit');
const { sendWelcomeEmail } = require('../services/email');

const router = express.Router();
const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe: 8 caractères minimum'),
  firstName: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// POST /auth/register
router.post('/register', authLimit, async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }

    const hashed = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        firstName: data.firstName || null
      },
      select: { id: true, email: true, firstName: true, plan: true }
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    });

    // Email bienvenue (async, on n'attend pas)
    sendWelcomeEmail(user.email, user.firstName).catch(console.error);

    res.status(201).json({ token, user });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error('[AUTH] register:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /auth/login
router.post('/login', authLimit, async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.active) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, firstName: user.firstName, plan: user.plan }
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error('[AUTH] login:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /auth/me
router.get('/me', require('../middleware/auth').authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, firstName: true, plan: true, createdAt: true }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PATCH /auth/me - Mettre à jour le profil
router.patch('/me', require('../middleware/auth').authMiddleware, async (req, res) => {
  try {
    const { firstName, email } = req.body
    const updates = {}
    if (firstName) updates.firstName = firstName
    if (email) updates.email = email
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updates,
      select: { id: true, email: true, firstName: true, plan: true }
    })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// DELETE /auth/me - Supprimer le compte
router.delete('/me', require('../middleware/auth').authMiddleware, async (req, res) => {
  try {
    await prisma.fitPlan.deleteMany({ where: { userId: req.user.id } })
    await prisma.user.delete({ where: { id: req.user.id } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /auth/logout (stateless JWT - juste pour compatibilité)
router.post('/logout', (req, res) => {
  res.json({ success: true });
});

module.exports = router;
