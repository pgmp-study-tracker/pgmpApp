import { NextRequest, NextResponse } from 'next/server';

// Global storage shared between sync and progress routes
declare global {
  var pgmpStorage: {
    users: Map<string, {
      id: string;
      syncCode: string;
      name: string | null;
      devices: { id: string; deviceName: string; deviceType: string; lastSyncAt: string }[];
      taskProgress: Map<string, any>;
    }>;
    syncCodes: Map<string, string>; // syncCode -> userId mapping
  };
}

// Initialize global storage if not exists
if (!globalThis.pgmpStorage) {
  globalThis.pgmpStorage = {
    users: new Map(),
    syncCodes: new Map(),
  };
}

// Generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Generate a user-friendly sync code
function generateSyncCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'PGMP-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  code += '-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Ensure uniqueness
  if (globalThis.pgmpStorage.syncCodes.has(code)) {
    return generateSyncCode(); // Recurse if collision
  }
  return code;
}

// POST - Create a new sync user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceName, deviceType, name } = body;

    const syncCode = generateSyncCode();
    const userId = generateId();
    const deviceId = generateId();

    // Store in global memory
    globalThis.pgmpStorage.users.set(userId, {
      id: userId,
      syncCode,
      name: name || null,
      devices: [{
        id: deviceId,
        deviceName: deviceName || 'Unknown Device',
        deviceType: deviceType || 'unknown',
        lastSyncAt: new Date().toISOString(),
      }],
      taskProgress: new Map(),
    });

    // Map syncCode to userId for quick lookup
    globalThis.pgmpStorage.syncCodes.set(syncCode, userId);

    return NextResponse.json({
      success: true,
      syncCode,
      userId,
      deviceId,
      message: 'Sync account created! Save your sync code to access from other devices.',
    });
  } catch (error) {
    console.error('Error creating sync user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create sync account' },
      { status: 500 }
    );
  }
}

// PUT - Join existing sync account with code
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { syncCode, deviceName, deviceType } = body;

    if (!syncCode) {
      return NextResponse.json(
        { success: false, error: 'Sync code is required' },
        { status: 400 }
      );
    }

    // Find user by sync code using the mapping
    const userId = globalThis.pgmpStorage.syncCodes.get(syncCode.toUpperCase());
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid sync code' },
        { status: 404 }
      );
    }

    const foundUser = globalThis.pgmpStorage.users.get(userId);
    
    if (!foundUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Register this device
    const deviceId = generateId();
    foundUser.devices.push({
      id: deviceId,
      deviceName: deviceName || 'Unknown Device',
      deviceType: deviceType || 'unknown',
      lastSyncAt: new Date().toISOString(),
    });

    // Convert taskProgress map to array
    const taskProgressArray = Array.from(foundUser.taskProgress.values());

    return NextResponse.json({
      success: true,
      userId: foundUser.id,
      deviceId,
      syncCode: foundUser.syncCode,
      name: foundUser.name,
      taskProgress: taskProgressArray,
      message: 'Successfully connected to sync account!',
    });
  } catch (error) {
    console.error('Error joining sync account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to join sync account' },
      { status: 500 }
    );
  }
}
