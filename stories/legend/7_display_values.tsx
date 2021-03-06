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

import { boolean, select } from '@storybook/addon-knobs';
import React from 'react';

import { AreaSeries, Axis, Chart, CurveType, Position, ScaleType, Settings } from '../../packages/charts/src';
import { TSVB_DATASET } from '../../packages/charts/src/utils/data_samples/test_dataset_tsvb';
import { arrayKnobs } from '../utils/knobs';

export const Example = () => {
  const showLegendDisplayValue = boolean('show display value in legend', true);
  const legendPosition = select(
    'legendPosition',
    {
      right: Position.Right,
      bottom: Position.Bottom,
      left: Position.Left,
      top: Position.Top,
    },
    Position.Right,
  );

  const tsvbSeries = TSVB_DATASET.series;

  const namesArray = arrayKnobs('series names (in sort order)', ['jpg', 'php', 'png', 'css', 'gif']);

  const seriesComponents = tsvbSeries.map((series: any) => {
    const nameIndex = namesArray.findIndex((name) => name === series.label);
    const sortIndex = nameIndex > -1 ? nameIndex : undefined;

    return (
      <AreaSeries
        key={`${series.id}-${series.label}`}
        id={`${series.id}-${series.label}`}
        name={series.label}
        xScaleType={ScaleType.Time}
        yScaleType={ScaleType.Linear}
        xAccessor={0}
        yAccessors={[1]}
        data={series.data}
        curve={series.lines.steps ? CurveType.CURVE_STEP : CurveType.LINEAR}
        sortIndex={sortIndex}
      />
    );
  });
  return (
    <Chart className="story-chart">
      <Settings showLegend legendPosition={legendPosition} showLegendExtra={showLegendDisplayValue} />
      <Axis id="bottom" position={Position.Bottom} title="Bottom axis" showOverlappingTicks />
      <Axis id="left2" title="Left axis" position={Position.Left} tickFormat={(d) => Number(d).toFixed(2)} />
      {seriesComponents}
    </Chart>
  );
};
