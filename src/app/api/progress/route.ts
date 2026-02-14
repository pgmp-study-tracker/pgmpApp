import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (shared with sync route)
// Note: This is a separate module, so for production you'd need a real database
// For now, we'll use a global variable to share state
declare global {
  var pgmpStorage: {
    users: Map<string, {
      id: string;
      syncCode: string;
      taskProgress: Map<string, any>;
    }>;
  };
}

// Initialize global storage if not exists
if (!globalThis.pgmpStorage) {
  globalThis.pgmpStorage = {
    users: new Map(),
  };
}

// GET - Fetch all progress for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = globalThis.pgmpStorage.users.get(userId);
    
    if (!user) {
      // Return empty progress if user not found
      return NextResponse.json({
        success: true,
        taskProgress: {},
        lastSync: new Date().toISOString(),
      });
    }

    // Convert Map to object
    const progressMap: Record<string, any> = {};
    user.taskProgress.forEach((value, key) => {
      progressMap[key] = value;
    });

    return NextResponse.json({
      success: true,
      taskProgress: progressMap,
      lastSync: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

// POST - Save/update task progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, taskId, completed, completedAt, skipped, skippedAt, notes } = body;

    if (!userId || !taskId) {
      return NextResponse.json(
        { success: false, error: 'User ID and Task ID are required' },
        { status: 400 }
      );
    }

    // Get or create user storage
    let user = globalThis.pgmpStorage.users.get(userId);
    if (!user) {
      user = {
        id: userId,
        syncCode: '',
        taskProgress: new Map(),
      };
      globalThis.pgmpStorage.users.set(userId, user);
    }

    // Update progress
    user.taskProgress.set(taskId, {
      taskId,
      completed,
      completedAt,
      skipped,
      skippedAt,
      notes,
    });

    return NextResponse.json({
      success: true,
      progress: user.taskProgress.get(taskId),
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}

// PUT - Batch sync progress (upload local changes)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, deviceId, progress } = body;

    if (!userId || !progress) {
      return NextResponse.json(
        { success: false, error: 'User ID and progress data are required' },
        { status: 400 }
      );
    }

    // Get or create user storage
    let user = globalThis.pgmpStorage.users.get(userId);
    if (!user) {
      user = {
        id: userId,
        syncCode: '',
        taskProgress: new Map(),
      };
      globalThis.pgmpStorage.users.set(userId, user);
    }

    // Merge progress
    Object.entries(progress).forEach(([taskId, data]: [string, any]) => {
      user!.taskProgress.set(taskId, {
        taskId,
        completed: data.completed,
        completedAt: data.completedAt,
        skipped: data.skipped,
        skippedAt: data.skippedAt,
        notes: data.notes,
      });
    });

    // Return merged progress
    const progressMap: Record<string, any> = {};
    user.taskProgress.forEach((value, key) => {
      progressMap[key] = value;
    });

    return NextResponse.json({
      success: true,
      taskProgress: progressMap,
      lastSync: new Date().toISOString(),
      message: 'Progress synced successfully!',
    });
  } catch (error) {
    console.error('Error syncing progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync progress' },
      { status: 500 }
    );
  }
}
