/**
 * Routine Testing and Verification Utilities
 * Use these functions to test the routine workflow after backend fixes
 */

import { routinesApi } from '../services/routinesApi';
import { RoutineCreateRequest } from '../services/routinesApi';

export interface RoutineTestResult {
    success: boolean;
    message: string;
    data?: any;
    error?: any;
}

/**
 * Test routine creation workflow
 */
export const testRoutineCreation = async (analysisId: string): Promise<RoutineTestResult> => {
    try {
        console.log('🧪 Testing routine creation...');

        const testMorningRoutine: RoutineCreateRequest = {
            name: 'Test Morning Routine',
            routine_type: 'morning',
            steps: [
                {
                    step: 'Cleanser: Gentle Face Wash',
                    order: 1,
                    instructions: 'Apply to wet face, massage gently, rinse with lukewarm water',
                    duration_seconds: 60,
                    optional: false
                },
                {
                    step: 'Serum: Vitamin C',
                    order: 2,
                    instructions: 'Apply 2-3 drops to clean face',
                    duration_seconds: 30,
                    optional: false
                },
                {
                    step: 'Moisturizer: Daily Hydration',
                    order: 3,
                    instructions: 'Apply evenly to face and neck',
                    duration_seconds: 45,
                    optional: false
                },
                {
                    step: 'Sunscreen: SPF 30+',
                    order: 4,
                    instructions: 'Apply generously 15 minutes before sun exposure',
                    duration_seconds: 60,
                    optional: false
                }
            ],
            analysis_id: analysisId,
            notes: 'Test routine created via utility function'
        };

        const result = await routinesApi.createRoutine(testMorningRoutine);

        return {
            success: true,
            message: 'Routine created successfully',
            data: {
                id: result.id,
                name: result.name,
                type: result.routine_type,
                steps: result.steps.length,
                active: result.is_active
            }
        };
    } catch (error: any) {
        return {
            success: false,
            message: 'Failed to create routine',
            error: {
                message: error?.message,
                status: error?.status,
                details: error
            }
        };
    }
};

/**
 * Test active routines fetching
 */
export const testActiveRoutinesFetch = async (): Promise<RoutineTestResult> => {
    try {
        console.log('🧪 Testing active routines fetch...');

        const result = await routinesApi.getActiveRoutines();

        return {
            success: true,
            message: 'Active routines fetched successfully',
            data: {
                total: result.total,
                count: result.routines?.length || 0,
                routines: result.routines?.map(r => ({
                    id: r.id,
                    name: r.name,
                    type: r.routine_type,
                    steps: r.steps?.length || 0,
                    active: r.is_active
                })) || []
            }
        };
    } catch (error: any) {
        return {
            success: false,
            message: 'Failed to fetch active routines',
            error: {
                message: error?.message,
                status: error?.status,
                details: error
            }
        };
    }
};

/**
 * Test routine statistics
 */
export const testRoutineStats = async (): Promise<RoutineTestResult> => {
    try {
        console.log('🧪 Testing routine stats...');

        const result = await routinesApi.getRoutineStats();

        return {
            success: true,
            message: 'Routine stats fetched successfully',
            data: result
        };
    } catch (error: any) {
        return {
            success: false,
            message: 'Failed to fetch routine stats',
            error: {
                message: error?.message,
                status: error?.status,
                details: error
            }
        };
    }
};

/**
 * Test debug endpoint
 */
export const testDebugEndpoint = async (): Promise<RoutineTestResult> => {
    try {
        console.log('🧪 Testing debug endpoint...');

        const result = await routinesApi.debugRoutineState();

        return {
            success: true,
            message: 'Debug endpoint working',
            data: result
        };
    } catch (error: any) {
        return {
            success: false,
            message: 'Debug endpoint failed',
            error: {
                message: error?.message,
                status: error?.status,
                details: error
            }
        };
    }
};

/**
 * Run comprehensive routine workflow test
 */
export const runCompleteRoutineTest = async (analysisId: string): Promise<RoutineTestResult[]> => {
    console.log('🚀 Running complete routine workflow test...');

    const results = [];

    // Test 1: Debug endpoint
    results.push(await testDebugEndpoint());

    // Test 2: Create routine
    results.push(await testRoutineCreation(analysisId));

    // Test 3: Fetch active routines
    results.push(await testActiveRoutinesFetch());

    // Test 4: Get stats
    results.push(await testRoutineStats());

    // Summary
    const successCount = results.filter(r => r.success).length;
    const totalTests = results.length;

    console.log(`✅ Routine test summary: ${successCount}/${totalTests} tests passed`);

    results.forEach((result, index) => {
        const status = result.success ? '✅' : '❌';
        console.log(`${status} Test ${index + 1}: ${result.message}`);
        if (!result.success) {
            console.error('   Error:', result.error);
        }
    });

    return results;
};

/**
 * Routine workflow verification checklist
 */
export const getRoutineVerificationChecklist = () => {
    return {
        title: '📋 Routine Workflow Verification Checklist',
        steps: [
            {
                step: 1,
                description: 'User completes skin analysis',
                check: 'Verify analysis_id is available'
            },
            {
                step: 2,
                description: 'User views CustomRoutineDetail screen',
                check: 'Screen loads with routine recommendations'
            },
            {
                step: 3,
                description: 'User saves routines',
                check: 'Both morning and evening routines created successfully'
            },
            {
                step: 4,
                description: 'User navigates to RoutineScreen',
                check: 'Active routines are displayed'
            },
            {
                step: 5,
                description: 'User can interact with routines',
                check: 'Can mark steps complete and record progress'
            }
        ],
        verificationCommands: [
            'await testActiveRoutinesFetch()',
            'await testRoutineCreation(analysisId)',
            'await runCompleteRoutineTest(analysisId)',
            'await testDebugEndpoint()'
        ]
    };
}; 