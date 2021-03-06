import { SAVE_NEXT_STEPS, REMOVE_PREVIOUS_STEP, ADD_PREVIOUS_STEP } from '../mutations';

describe('contentNode mutations', () => {
  describe('SAVE_NEXT_STEPS', () => {
    let state, nodeId, prerequisite_mapping, postrequisite_mapping;

    beforeEach(() => {
      nodeId = 'id-integrals';

      prerequisite_mapping = {
        'id-elementary-math': {
          'id-reading': {},
        },
      };

      postrequisite_mapping = {
        'id-physics': {
          'id-astronomy': {
            'id-spaceships-contruction': {},
          },
        },
        'id-chemistry': {
          'id-lab': {},
        },
      };
    });

    it(`should save the complete chain of previous/next steps to next steps map`, () => {
      state = {
        nextStepsMap: [],
      };

      SAVE_NEXT_STEPS(state, { nodeId, prerequisite_mapping, postrequisite_mapping });

      expect(state.nextStepsMap).toEqual([
        ['id-integrals', 'id-physics'],
        ['id-physics', 'id-astronomy'],
        ['id-astronomy', 'id-spaceships-contruction'],
        ['id-integrals', 'id-chemistry'],
        ['id-chemistry', 'id-lab'],
        ['id-elementary-math', 'id-integrals'],
        ['id-reading', 'id-elementary-math'],
      ]);
    });

    it("shouldn't save duplicates", () => {
      state = {
        nextStepsMap: [
          ['id-physics', 'id-astronomy'],
          ['id-reading', 'id-philosophy'],
          ['id-chemistry', 'id-lab'],
        ],
      };

      SAVE_NEXT_STEPS(state, { nodeId, prerequisite_mapping, postrequisite_mapping });

      expect(state.nextStepsMap).toEqual([
        ['id-reading', 'id-philosophy'],
        ['id-integrals', 'id-physics'],
        ['id-physics', 'id-astronomy'],
        ['id-astronomy', 'id-spaceships-contruction'],
        ['id-integrals', 'id-chemistry'],
        ['id-chemistry', 'id-lab'],
        ['id-elementary-math', 'id-integrals'],
        ['id-reading', 'id-elementary-math'],
      ]);
    });
  });

  describe('REMOVE_PREVIOUS_STEP', () => {
    let state;

    it('removes a corresponding entry from next steps map', () => {
      state = {
        nextStepsMap: [
          ['id-integrals', 'id-physics'],
          ['id-reading', 'id-physics'],
          ['id-physics', 'id-astronomy'],
        ],
      };

      REMOVE_PREVIOUS_STEP(state, {
        targetId: 'id-physics',
        previousStepId: 'id-integrals',
      });

      expect(state.nextStepsMap).toEqual([
        ['id-reading', 'id-physics'],
        ['id-physics', 'id-astronomy'],
      ]);
    });
  });

  describe('ADD_PREVIOUS_STEP', () => {
    let state;

    beforeEach(() => {
      state = {
        nextStepsMap: [
          ['id-integrals', 'id-physics'],
          ['id-reading', 'id-physics'],
          ['id-physics', 'id-astronomy'],
        ],
      };
    });

    it("doesn't add an entry to next steps map if it's there already", () => {
      ADD_PREVIOUS_STEP(state, {
        targetId: 'id-physics',
        previousStepId: 'id-reading',
      });

      expect(state.nextStepsMap).toEqual([
        ['id-integrals', 'id-physics'],
        ['id-reading', 'id-physics'],
        ['id-physics', 'id-astronomy'],
      ]);
    });

    it('adds an entry to next steps map', () => {
      ADD_PREVIOUS_STEP(state, {
        targetId: 'id-spaceships-engineering',
        previousStepId: 'id-astronomy',
      });

      expect(state.nextStepsMap).toEqual([
        ['id-integrals', 'id-physics'],
        ['id-reading', 'id-physics'],
        ['id-physics', 'id-astronomy'],
        ['id-astronomy', 'id-spaceships-engineering'],
      ]);
    });
  });
});
