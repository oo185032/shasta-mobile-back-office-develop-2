const pipeline = [
  {
    $lookup: {
      from: 'userDocument',
      localField: 'documentId',
      foreignField: 'documentId',
      as: 'agg.userDocs',
    },
  },
  {
    $unwind: {
      path: '$agg.userDocs',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $addFields: {
      'agg.asArray': {
        $objectToArray: '$agg.userDocs.inventoryCounts',
      },
    },
  },
  {
    $unwind: {
      path: '$agg.asArray',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $group: {
      _id: {
        documentId: '$documentId',
        organization: '$organization',
        enterpriseUnit: '$enterpriseUnit',
        key: {
          $ifNull: ['$agg.asArray.k', '$noval'],
        },
      },
      root: {
        $first: '$$ROOT',
      },
      val: {
        $sum: '$agg.asArray.v',
      },
      updatedDateTime: {
        $max: '$agg.userDocs.updatedDateTime',
      },
      users: {
        $push: '$agg.userDocs.user',
      },
      completedStatus: {
        $push: {
          $ifNull: ['$agg.userDocs.completed', null],
        },
      },
    },
  },
  {
    $project: {
      root: 1,
      updatedDateTime: 1,
      users: 1,
      completedStatus: 1,
      val: {
        $cond: [
          {
            $lte: ['$_id.key', null],
          },
          '$$REMOVE',
          '$val',
        ],
      },
    },
  },
  {
    $addFields: {
      allCompleted: {
        $anyElementTrue: '$completedStatus',
      },
    },
  },
  {
    $group: {
      _id: {
        documentId: '$_id.documentId',
        organization: '$_id.organization',
        enterpriseUnit: '$_id.enterpriseUnit',
      },
      root: {
        $first: '$root',
      },
      inventoryCounts: {
        $push: {
          $cond: [
            {
              $lte: ['$_id.key', null],
            },
            '$noval',
            {
              k: '$_id.key',
              v: '$val',
            },
          ],
        },
      },
      users: {
        $push: '$users',
      },
      allCompleted: {
        $push: '$allCompleted',
      },
      updatedDateTime: {
        $max: '$updatedDateTime',
      },
    },
  },
  {
    $addFields: {
      inventoryCounts: {
        $arrayToObject: '$inventoryCounts',
      },
      users: {
        $reduce: {
          input: '$users',
          initialValue: [],
          in: {
            $concatArrays: ['$$this', '$$value'],
          },
        },
      },
      allCompleted: {
        $anyElementTrue: ['$allCompleted'],
      },
    },
  },
  {
    $addFields: {
      users: {
        $setUnion: ['$users', []],
      },
    },
  },
  {
    $addFields: {
      status: {
        $switch: {
          branches: [
            {
              case: {
                $eq: [
                  {
                    $size: '$users',
                  },
                  0,
                ],
              },
              then: 'New',
            },
            {
              case: {
                $eq: ['$root.approved', true],
              },
              then: 'Approved',
            },
            {
              case: {
                $eq: ['$root.rejected', true],
              },
              then: 'Rejected',
            },
            {
              case: {
                $eq: ['$allCompleted', true],
              },
              then: 'Pending Approval',
            },
          ],
          default: 'In Progress',
        },
      },
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [
          '$root',
          {
            inventoryCounts: '$inventoryCounts',
            updatedDateTime: '$updatedDateTime',
            users: '$users',
            status: '$status',
          },
        ],
      },
    },
  },
  {
    $project: {
      agg: 0,
    },
  },
];

export default pipeline;
