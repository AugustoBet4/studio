import { mount } from '@vue/test-utils';
import FileStatusText from '../FileStatusText.vue';
import storeFactory from 'shared/vuex/baseStore';
import { fileErrors } from 'shared/constants';

const fileUploads = {
  'file-1': { checksum: 'file-1', loaded: 2, total: 2 },
  'file-2': { checksum: 'file-2', loaded: 1, total: 2 },
  'file-3': { checksum: 'file-3', error: fileErrors.UPLOAD_FAILED },
};

function makeWrapper(checksum) {
  const store = storeFactory();
  store.state.file.fileUploadsMap[checksum] = fileUploads[checksum];
  return mount(FileStatusText, {
    store,
    attachToDocument: true,
    propsData: {
      checksum,
    },
  });
}

describe('fileStatusText', () => {
  it('should show error text if a file has an error', () => {
    let wrapper = makeWrapper('file-3');
    expect(wrapper.find('[data-test="error"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="progress"]').exists()).toBe(false);

    wrapper = makeWrapper('file-1');
    expect(wrapper.find('[data-test="error"]').exists()).toBe(false);
  });
  it('should hide upload link in readonly mode', () => {
    let wrapper = makeWrapper('file-2');
    wrapper.setProps({ readonly: true });
    expect(wrapper.find('[data-test="upload"]').exists()).toBe(false);
  });
  it('should indicate if one of the files is uploading', () => {
    let wrapper = makeWrapper('file-2');
    expect(wrapper.find('[data-test="progress"]').exists()).toBe(true);
  });
  it('should show nothing if files are done uploading', () => {
    let wrapper = makeWrapper('file-1');
    expect(wrapper.find('[data-test="error"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="progress"]').exists()).toBe(false);
  });
});
