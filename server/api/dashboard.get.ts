import { Client } from '../models/client.schema'
import { Corporation } from '../models/corporation.schema'
import { PersonalTax } from '../models/personalTax.schema'
import { CorporationTax } from '../models/corporationTax.schema'
import { User } from '../models/user.schema'
import { verifyToken } from '../utils/jwt'

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1]
  if (!token) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const decoded = await verifyToken(token)
    const isAdmin = decoded.role === 'admin'

    // Fetch all data from models in parallel with optimized queries
    const [clients, corporations, personalTaxes, corporationTaxes, users] = await Promise.all([
      Client.find().sort({ lts: -1 }).limit(5),
      Corporation.find().sort({ ts: -1 }).limit(5),
      PersonalTax.find().sort({ targetDueDate: 1 }).limit(5),
      CorporationTax.find().sort({ dueDate: 1 }).limit(5),
      isAdmin ? User.find() : []
    ])

    // Calculate statistics
    const stats = {
      totalClients: 0,
      totalCorporations: 0,
      pendingTasks: 0,
      completedTasks: 0,
      totalRevenue: 0,
      employees: 0
    }

    let upcomingDeadlines = []

    // Process clients
    if (clients && clients.length > 0) {
      stats.totalClients = await Client.countDocuments()
      stats.employees = isAdmin ? await User.countDocuments() : 0
    }

    // Process corporations
    if (corporations && corporations.length > 0) {
      stats.totalCorporations = corporations.length
    }

    // Process personal tax tasks
    if (personalTaxes && personalTaxes.length > 0) {
      const pending = personalTaxes.filter((t: any) => !t.completed)
      const completed = personalTaxes.filter((t: any) => t.completed)

      stats.pendingTasks += pending.length
      stats.completedTasks += completed.length

      const paidTasks = personalTaxes.filter((t: any) => t.paid && t.payment)
      stats.totalRevenue += paidTasks.reduce((sum: number, t: any) => sum + (parseFloat(t.payment) || 0), 0)

      // Get upcoming deadlines (already sorted by dueDate)
      const upcoming = personalTaxes
        .filter((t: any) => !t.completed && t.targetDueDate)
        .slice(0, 5)
        .map((t: any) => ({
          type: 'Personal Tax',
          description: t.taskDescription,
          clientId: t.clientId,
          dueDate: t.targetDueDate,
          priority: t.priority
        }))

      upcomingDeadlines.push(...upcoming)
    }

    // Process corporate tax tasks
    if (corporationTaxes && corporationTaxes.length > 0) {
      const pending = corporationTaxes.filter((t: any) => !t.completed)
      const completed = corporationTaxes.filter((t: any) => t.completed)

      stats.pendingTasks += pending.length
      stats.completedTasks += completed.length

      const paidTasks = corporationTaxes.filter((t: any) => t.paid && t.payment)
      stats.totalRevenue += paidTasks.reduce((sum: number, t: any) => sum + (parseFloat(t.payment) || 0), 0)

      // Get upcoming deadlines (already sorted by dueDate)
      const upcoming = corporationTaxes
        .filter((t: any) => !t.completed && t.dueDate)
        .slice(0, 5)
        .map((t: any) => ({
          type: 'Corporate Tax',
          description: t.taskDescription,
          corpId: t.corpId,
          dueDate: t.dueDate,
          priority: t.priority
        }))

      upcomingDeadlines.push(...upcoming)
    }

    // Sort and limit upcoming deadlines
    upcomingDeadlines = upcomingDeadlines
      .sort((a: any, b: any) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5)

    return {
      success: true,
      stats,
      recentClients: clients || [],
      upcomingDeadlines
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch dashboard data'
    }
  }
})
