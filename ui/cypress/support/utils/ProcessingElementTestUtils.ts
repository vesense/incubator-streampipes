/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { FileManagementUtils } from './FileManagementUtils';
import { AdapterUtils } from './AdapterUtils';
import { PipelineElementInput } from '../model/PipelineElementInput';
import { PipelineUtils } from './PipelineUtils';
import { DataLakeUtils } from './DataLakeUtils';
import { GenericAdapterBuilder } from '../builder/GenericAdapterBuilder';
import { PipelineBuilder } from '../builder/PipelineBuilder';
import { PipelineElementBuilder } from '../builder/PipelineElementBuilder';
import { ProcessorTest } from '../model/ProcessorTest';

export class ProcessingElementTestUtils {

    public static testElement(pipelineElementTest: ProcessorTest) {
        // public static testElement(testName: string, inputFile: string, expectedResultFile: string, processor: PipelineElementInput) {
        // Test

        const inputFile = 'pipelineElement/' + pipelineElementTest.dir + '/' + pipelineElementTest.inputFile;
        const expectedResultFile = 'pipelineElement/' + pipelineElementTest.dir + '/expected.csv';

        let formatType;
        pipelineElementTest.inputFile.endsWith('.csv') ? formatType = 'csv' : formatType = 'json_array_no_key';

        FileManagementUtils.addFile(inputFile);

        const dataLakeIndex = pipelineElementTest.name.toLowerCase();

        const adapterName = pipelineElementTest.name.toLowerCase();

        // Build adapter
        const adapterInputBuilder = GenericAdapterBuilder
          .create('File_Set')
          .setName(adapterName)
          .setTimestampProperty('timestamp')
          .addProtocolInput('input', 'interval-key', '0')
          .setFormat(formatType);

        if (formatType === 'csv') {
            adapterInputBuilder
              .addFormatInput('input', 'delimiter', ';')
              .addFormatInput('checkbox', 'header', 'check');
        }

        const adapterInput = adapterInputBuilder.build();

        AdapterUtils.addGenericSetAdapter(adapterInput);

        // Build Pipeline
        const pipelineInput = PipelineBuilder.create(pipelineElementTest.name)
          .addSource(adapterName)
          .addProcessingElement(pipelineElementTest.processor)
          .addSink(
            PipelineElementBuilder.create('data_lake')
              .addInput('input', 'db_measurement', dataLakeIndex)
              .build())
          .build();

        PipelineUtils.addPipeline(pipelineInput);

        // // Wait
        it('Wait till data is stored', () => {
            cy.wait(10000);
        });

        DataLakeUtils.checkResults(dataLakeIndex, 'cypress/fixtures/' + expectedResultFile);

        PipelineUtils.deletePipeline();

        AdapterUtils.deleteAdapter();

        FileManagementUtils.deleteFile();
    }
}
