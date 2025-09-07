const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../../config/database');
const { protect } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// @desc    Get pet health records
// @route   GET /api/health/pets/:petId
// @access  Private
router.get('/pets/:petId', protect, async (req, res) => {
  try {
    const pet = await db('pets')
      .where('id', req.params.petId)
      .where('owner_id', req.user.id)
      .first();

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Get health records from pet's health_info
    const healthRecords = pet.health_info || {};

    res.json({
      success: true,
      data: {
        petId: pet.id,
        petName: pet.name,
        healthRecords
      }
    });
  } catch (error) {
    logger.error('Get pet health records error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update pet health records
// @route   PUT /api/health/pets/:petId
// @access  Private
router.put('/pets/:petId', protect, async (req, res) => {
  try {
    const { healthRecords } = req.body;

    const pet = await db('pets')
      .where('id', req.params.petId)
      .where('owner_id', req.user.id)
      .first();

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Update health records
    await db('pets')
      .where('id', req.params.petId)
      .update({
        health_info: healthRecords,
        updated_at: new Date()
      });

    res.json({
      success: true,
      message: 'Health records updated successfully'
    });
  } catch (error) {
    logger.error('Update pet health records error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Add vaccination record
// @route   POST /api/health/pets/:petId/vaccinations
// @access  Private
router.post('/pets/:petId/vaccinations', protect, async (req, res) => {
  try {
    const { vaccineName, dateGiven, nextDueDate, veterinarian, notes } = req.body;

    const pet = await db('pets')
      .where('id', req.params.petId)
      .where('owner_id', req.user.id)
      .first();

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    const vaccinationRecord = {
      id: uuidv4(),
      vaccineName,
      dateGiven,
      nextDueDate,
      veterinarian,
      notes,
      createdAt: new Date()
    };

    // Get existing health info
    const healthInfo = pet.health_info || {};
    const vaccinations = healthInfo.vaccinations || [];

    // Add new vaccination
    vaccinations.push(vaccinationRecord);

    // Update health info
    await db('pets')
      .where('id', req.params.petId)
      .update({
        health_info: {
          ...healthInfo,
          vaccinations
        },
        updated_at: new Date()
      });

    res.status(201).json({
      success: true,
      data: vaccinationRecord
    });
  } catch (error) {
    logger.error('Add vaccination record error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Add medication record
// @route   POST /api/health/pets/:petId/medications
// @access  Private
router.post('/pets/:petId/medications', protect, async (req, res) => {
  try {
    const { medicationName, dosage, frequency, startDate, endDate, veterinarian, notes } = req.body;

    const pet = await db('pets')
      .where('id', req.params.petId)
      .where('owner_id', req.user.id)
      .first();

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    const medicationRecord = {
      id: uuidv4(),
      medicationName,
      dosage,
      frequency,
      startDate,
      endDate,
      veterinarian,
      notes,
      createdAt: new Date()
    };

    // Get existing health info
    const healthInfo = pet.health_info || {};
    const medications = healthInfo.medications || [];

    // Add new medication
    medications.push(medicationRecord);

    // Update health info
    await db('pets')
      .where('id', req.params.petId)
      .update({
        health_info: {
          ...healthInfo,
          medications
        },
        updated_at: new Date()
      });

    res.status(201).json({
      success: true,
      data: medicationRecord
    });
  } catch (error) {
    logger.error('Add medication record error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Add vet visit record
// @route   POST /api/health/pets/:petId/visits
// @access  Private
router.post('/pets/:petId/visits', protect, async (req, res) => {
  try {
    const { visitDate, reason, diagnosis, treatment, veterinarian, notes, followUpDate } = req.body;

    const pet = await db('pets')
      .where('id', req.params.petId)
      .where('owner_id', req.user.id)
      .first();

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    const visitRecord = {
      id: uuidv4(),
      visitDate,
      reason,
      diagnosis,
      treatment,
      veterinarian,
      notes,
      followUpDate,
      createdAt: new Date()
    };

    // Get existing health info
    const healthInfo = pet.health_info || {};
    const visits = healthInfo.visits || [];

    // Add new visit
    visits.push(visitRecord);

    // Update health info
    await db('pets')
      .where('id', req.params.petId)
      .update({
        health_info: {
          ...healthInfo,
          visits
        },
        updated_at: new Date()
      });

    res.status(201).json({
      success: true,
      data: visitRecord
    });
  } catch (error) {
    logger.error('Add vet visit record error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get upcoming reminders
// @route   GET /api/health/reminders
// @access  Private
router.get('/reminders', protect, async (req, res) => {
  try {
    const { days = 30 } = req.query;

    // Get user's pets
    const pets = await db('pets')
      .where('owner_id', req.user.id)
      .select('id', 'name', 'health_info');

    const reminders = [];

    pets.forEach(pet => {
      const healthInfo = pet.health_info || {};
      const vaccinations = healthInfo.vaccinations || [];
      const medications = healthInfo.medications || [];
      const visits = healthInfo.visits || [];

      // Check vaccination reminders
      vaccinations.forEach(vaccination => {
        if (vaccination.nextDueDate) {
          const dueDate = new Date(vaccination.nextDueDate);
          const today = new Date();
          const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

          if (diffDays <= days && diffDays >= 0) {
            reminders.push({
              type: 'vaccination',
              petId: pet.id,
              petName: pet.name,
              title: `${vaccination.vaccineName} due`,
              dueDate: vaccination.nextDueDate,
              daysUntil: diffDays,
              record: vaccination
            });
          }
        }
      });

      // Check medication reminders
      medications.forEach(medication => {
        if (medication.endDate) {
          const endDate = new Date(medication.endDate);
          const today = new Date();
          const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

          if (diffDays <= days && diffDays >= 0) {
            reminders.push({
              type: 'medication',
              petId: pet.id,
              petName: pet.name,
              title: `${medication.medicationName} ends`,
              dueDate: medication.endDate,
              daysUntil: diffDays,
              record: medication
            });
          }
        }
      });

      // Check follow-up visit reminders
      visits.forEach(visit => {
        if (visit.followUpDate) {
          const followUpDate = new Date(visit.followUpDate);
          const today = new Date();
          const diffDays = Math.ceil((followUpDate - today) / (1000 * 60 * 60 * 24));

          if (diffDays <= days && diffDays >= 0) {
            reminders.push({
              type: 'followUp',
              petId: pet.id,
              petName: pet.name,
              title: 'Follow-up visit due',
              dueDate: visit.followUpDate,
              daysUntil: diffDays,
              record: visit
            });
          }
        }
      });
    });

    // Sort by days until due
    reminders.sort((a, b) => a.daysUntil - b.daysUntil);

    res.json({
      success: true,
      data: reminders
    });
  } catch (error) {
    logger.error('Get reminders error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get health statistics
// @route   GET /api/health/stats/:petId
// @access  Private
router.get('/stats/:petId', protect, async (req, res) => {
  try {
    const pet = await db('pets')
      .where('id', req.params.petId)
      .where('owner_id', req.user.id)
      .first();

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    const healthInfo = pet.health_info || {};
    const vaccinations = healthInfo.vaccinations || [];
    const medications = healthInfo.medications || [];
    const visits = healthInfo.visits || [];

    // Calculate statistics
    const stats = {
      totalVaccinations: vaccinations.length,
      totalMedications: medications.length,
      totalVisits: visits.length,
      upcomingVaccinations: vaccinations.filter(v => {
        const dueDate = new Date(v.nextDueDate);
        const today = new Date();
        return dueDate > today;
      }).length,
      activeMedications: medications.filter(m => {
        const endDate = new Date(m.endDate);
        const today = new Date();
        return endDate > today;
      }).length,
      recentVisits: visits.filter(v => {
        const visitDate = new Date(v.visitDate);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return visitDate > thirtyDaysAgo;
      }).length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Get health stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Export health records
// @route   GET /api/health/export/:petId
// @access  Private
router.get('/export/:petId', protect, async (req, res) => {
  try {
    const pet = await db('pets')
      .where('id', req.params.petId)
      .where('owner_id', req.user.id)
      .first();

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    const healthInfo = pet.health_info || {};

    // Create export data
    const exportData = {
      pet: {
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        weight: pet.weight
      },
      healthRecords: healthInfo,
      exportDate: new Date().toISOString()
    };

    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    logger.error('Export health records error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
