/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const fs = require('fs');

const sassGraph = require('sass-graph');

const graph = sassGraph.parseFile('./src/components/_index.scss');

const root = Object.keys(graph.index)[0];

const content = recursiveReadSCSS(root, graph.index[root]);

fs.writeFileSync('./dist/theme.scss', content);

function recursiveReadSCSS(branchId, branch) {
  if (branch.imports.length === 0) {
    return fs.readFileSync(branchId, 'utf8');
  }
  const file = fs.readFileSync(branchId, 'utf8');
  const sassFileContent = [];
  branch.imports.forEach((branchImport) => {
    sassFileContent.push(recursiveReadSCSS(branchImport, graph.index[branchImport]));
  });
  // remove imports
  const contentWithoutImports = removeImportsFromFile(file);
  sassFileContent.push(contentWithoutImports);
  return sassFileContent.join('\n');
}

function removeImportsFromFile(fileContent) {
  const lines = fileContent.split(/\r\n|\r|\n/g);

  return lines.filter((line) => !line.match(/@import\s/i)).join('\n');
}
