export default function buildMakeCourse() {
    return function makeComment({
        name,
        instituteId,
        mainCategories,
        subCategories,
        hasLive,
        hasRecorded,
        courseModules,
        isActive,
        location,
        country,
        state
    } = {}) {
        if (!name) {
            throw new Error('Name is must')
        }
        if (!instituteId) {
            throw new Error('instituteId is must')
        }
        if (mainCategories.length < 0) {
            throw new Error("Atlest one main category needed")
        }
        if (subCategories.length < 0) {
            throw new Error("Atlest one sub category needed")
        }
        //ToDo : Content sanitization

        return Object.freeze({
            getName: () => name,
            getInstituteId: () => instituteId,
            getMainCategories: () => mainCategories,
            getSubCategories: () => subCategories,
            getHasLive: () => hasLive,
            getHasRecorded: () => hasRecorded,
            getCourseModules: () => courseModules,
            getIsActive: () => isActive,
            getLocation: () => location,
            getCountry: () => country,
            getState: () => state
        })
    }
}
